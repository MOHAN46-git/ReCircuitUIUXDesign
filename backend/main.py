import os
import re
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from fastapi import FastAPI, Depends, HTTPException, Header, Query, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="ReCircuit Backend API", version="1.0.0")

# CORS setup
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:8443,http://localhost:3000,http://127.0.0.1:5173")
origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]
if "*" not in origins:
    origins.extend(["http://localhost:5173", "http://localhost:8443", "http://127.0.0.1:5173"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in origins else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", "")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

is_supabase_live = bool(
    SUPABASE_URL
    and SUPABASE_ANON_KEY
    and "your-project" not in SUPABASE_URL
    and "your-supabase-anon-key" not in SUPABASE_ANON_KEY
)

# -----------------------------------------------------------------------------
# In-Memory Database Fallback for Zero-Crash Offline / Local Testing
# -----------------------------------------------------------------------------
FALLBACK_PROFILES: Dict[str, Dict[str, Any]] = {}
FALLBACK_LISTINGS: List[Dict[str, Any]] = [
    {
        "id": "l-demo-1",
        "seller_id": "demo-seller-id",
        "name": "Arduino Uno R3",
        "quantity": 3,
        "condition": "Used — working, seller reported",
        "mode": "Sell",
        "price": 450.0,
        "archived": False,
        "weight_g": 45.0,
        "max_days": None,
        "deposit": 0.0,
        "metadata": {
            "category": "Microcontrollers",
            "media_paths": [],
            "image": "https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=400&q=80",
            "images": ["https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=400&q=80"],
            "description": "Tested ATmega328P microcontroller board from university robotics surplus.",
            "tags": "arduino, uno, mcu",
        }
    },
    {
        "id": "l-demo-2",
        "seller_id": "demo-seller-id",
        "name": "ESP32 DevKit V1",
        "quantity": 5,
        "condition": "Used — working, seller reported",
        "mode": "Sell",
        "price": 320.0,
        "archived": False,
        "weight_g": 35.0,
        "max_days": None,
        "deposit": 0.0,
        "metadata": {
            "category": "Microcontrollers",
            "media_paths": [],
            "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
            "images": ["https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80"],
            "description": "Dual-core Wi-Fi/BLE module. Clean solder pins.",
            "tags": "esp32, wifi, bluetooth, iot",
        }
    },
    {
        "id": "l-demo-3",
        "seller_id": "demo-seller-id",
        "name": "Ultrasonic Sensor HC-SR04",
        "quantity": 4,
        "condition": "Used — working, seller reported",
        "mode": "Donate",
        "price": 0.0,
        "archived": False,
        "weight_g": 15.0,
        "max_days": None,
        "deposit": 0.0,
        "metadata": {
            "category": "Sensors",
            "media_paths": [],
            "image": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80",
            "images": ["https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80"],
            "description": "Lab surplus distance sensor, donated for student robotics projects.",
            "tags": "ultrasonic, sensor, distance, hc-sr04",
        }
    }
]
FALLBACK_ORDERS: List[Dict[str, Any]] = []
FALLBACK_REQUESTS: Dict[str, str] = {}  # idempotency: request_id -> order_id
FALLBACK_IMPACT: List[Dict[str, Any]] = [
    {"id": "imp-1", "user_id": "demo-buyer-id", "reuse_g": 380.0, "source": "order_completion"}
]
FALLBACK_EWASTE: List[Dict[str, Any]] = []

KNOWLEDGE_BASE = [
    {
        "title": "Component Testing Before Reuse",
        "content": "Always test salvaged components with a current-limited bench supply or multimeter before live deployment. Check for short circuits between VCC and GND.",
        "category": "Safety"
    },
    {
        "title": "Dual Handover Confirmation",
        "content": "ReCircuit requires both the buyer and seller to confirm the exchange. Once both parties confirm, simulated payment escrow is released and reused mass is logged.",
        "category": "Handover"
    },
    {
        "title": "Responsible E-Waste Recycling",
        "content": "Components that cannot be reused or repaired should be routed to certified R2/e-Stewards recycling partners. E-waste items under 500g must be batched together.",
        "category": "E-Waste"
    },
    {
        "title": "Smart Plant Irrigation System BOM",
        "content": "The Smart Plant Irrigation System requires an ESP32 or Arduino, Capacitive Soil Moisture Sensor, 5V Single Channel Relay, and a Mini Submersible Water Pump.",
        "category": "Projects"
    }
]

# -----------------------------------------------------------------------------
# User Identity Dependency (Extracts Supabase JWT or Demo User)
# -----------------------------------------------------------------------------
class AuthenticatedUser(BaseModel):
    id: str
    email: str = "demo.user@recircuit.org"
    role: str = "both"

async def get_current_user(authorization: Optional[str] = Header(None)) -> AuthenticatedUser:
    if not authorization or not authorization.startswith("Bearer "):
        # In test / demo environment without JWT, allow seamless local demo access
        return AuthenticatedUser(id="demo-user-id", email="demo@recircuit.org", role="both")

    token = authorization.split("Bearer ")[1].strip()

    if is_supabase_live:
        try:
            from supabase import create_client
            client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
            user_response = client.auth.get_user(token)
            if user_response and user_response.user:
                u = user_response.user
                return AuthenticatedUser(
                    id=str(u.id),
                    email=u.email or "user@recircuit.org",
                    role=u.user_metadata.get("role", "both") if u.user_metadata else "both"
                )
        except Exception as e:
            # If token validation fails, raise 401
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=f"Invalid authentication token: {str(e)}")

    return AuthenticatedUser(id="demo-user-id", email="demo@recircuit.org", role="both")


# -----------------------------------------------------------------------------
# Pydantic Schemas
# -----------------------------------------------------------------------------
class ProfilePayload(BaseModel):
    name: str
    role: str
    details: Optional[Dict[str, Any]] = Field(default_factory=dict)

class ListingCreatePayload(BaseModel):
    name: str
    quantity: int
    mode: str
    price: float = 0.0
    condition: str
    weight_g: Optional[float] = None
    max_days: Optional[int] = None
    deposit: Optional[float] = 0.0
    metadata: Dict[str, Any] = Field(default_factory=dict)

class OrderCreatePayload(BaseModel):
    listing_id: str
    quantity: int
    days: Optional[int] = 1
    request_id: Optional[str] = None

class EWastePayload(BaseModel):
    route: str
    weight_g: Optional[float] = None
    media_path: Optional[str] = None
    quoted_rate_per_kg: Optional[float] = None
    quote_source: Optional[str] = None

class AIChatPayload(BaseModel):
    message: str

class AIAnalyzePayload(BaseModel):
    image: Optional[str] = None

class AIGeneratePayload(BaseModel):
    images: Optional[List[str]] = Field(default_factory=list)
    component: Optional[Dict[str, Any]] = Field(default_factory=dict)


# -----------------------------------------------------------------------------
# Endpoints
# -----------------------------------------------------------------------------

@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ReCircuit Backend API",
        "supabase_configured": is_supabase_live,
        "gemini_configured": bool(GEMINI_API_KEY and "your-gemini" not in GEMINI_API_KEY),
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# 1. Profile Endpoints
@app.get("/api/profile")
async def get_profile(user: AuthenticatedUser = Depends(get_current_user)):
    if is_supabase_live:
        try:
            from supabase import create_client
            client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
            res = client.table("profiles").select("*").eq("id", user.id).execute()
            if res.data:
                p = res.data[0]
                return [{
                    "id": p["id"],
                    "name": f"{p.get('first_name', '')} {p.get('last_name', '')}".strip() or p.get("name", "Maker"),
                    "role": p.get("role", "both"),
                    "details": p.get("details", {})
                }]
        except Exception:
            pass

    # Fallback store
    p = FALLBACK_PROFILES.get(user.id, {
        "id": user.id,
        "name": "Maker User",
        "role": user.role,
        "details": {}
    })
    return [p]

@app.post("/api/profile")
async def create_profile(payload: ProfilePayload, user: AuthenticatedUser = Depends(get_current_user)):
    profile_data = {
        "id": user.id,
        "name": payload.name,
        "role": payload.role,
        "details": payload.details or {}
    }
    FALLBACK_PROFILES[user.id] = profile_data

    if is_supabase_live:
        try:
            from supabase import create_client
            client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
            client.table("profiles").upsert(profile_data).execute()
        except Exception:
            pass

    return profile_data

@app.patch("/api/profile")
async def update_profile(payload: ProfilePayload, user: AuthenticatedUser = Depends(get_current_user)):
    current = FALLBACK_PROFILES.get(user.id, {"id": user.id, "details": {}})
    current["name"] = payload.name
    current["role"] = payload.role
    current["details"] = {**current.get("details", {}), **(payload.details or {})}
    FALLBACK_PROFILES[user.id] = current

    if is_supabase_live:
        try:
            from supabase import create_client
            client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
            client.table("profiles").update({
                "name": payload.name,
                "role": payload.role,
                "details": current["details"]
            }).eq("id", user.id).execute()
        except Exception:
            pass

    return current


# 2. Inventory Endpoint
@app.get("/api/inventory")
async def get_inventory(user: AuthenticatedUser = Depends(get_current_user)):
    # Returns items owned or received by buyer
    completed_orders = [o for o in FALLBACK_ORDERS if o.get("status") == "Completed" and o.get("buyer_id") == user.id]
    items = []
    for o in completed_orders:
        listing = next((l for l in FALLBACK_LISTINGS if l["id"] == o["listing_id"]), None)
        items.append({
            "id": o["id"],
            "name": o["name"],
            "quantity": o["quantity"],
            "weight_g": listing.get("weight_g", 50.0) if listing else 50.0,
            "metadata": listing.get("metadata", {}) if listing else {}
        })
    return items


# 3. Listings Endpoints
@app.get("/api/listings")
async def get_listings(own: bool = Query(False), user: AuthenticatedUser = Depends(get_current_user)):
    if own:
        return [l for l in FALLBACK_LISTINGS if l.get("seller_id") == user.id]
    return [l for l in FALLBACK_LISTINGS if not l.get("archived", False)]

@app.post("/api/listings")
async def create_listing(payload: ListingCreatePayload, user: AuthenticatedUser = Depends(get_current_user)):
    listing_id = f"l-{uuid.uuid4()}"
    new_listing = {
        "id": listing_id,
        "seller_id": user.id,
        "name": payload.name,
        "quantity": payload.quantity,
        "mode": payload.mode,
        "price": 0.0 if payload.mode == "Donate" else payload.price,
        "condition": payload.condition,
        "archived": False,
        "weight_g": payload.weight_g or 50.0,
        "max_days": payload.max_days if payload.mode == "Rent" else None,
        "deposit": payload.deposit or 0.0,
        "metadata": payload.metadata or {}
    }
    FALLBACK_LISTINGS.insert(0, new_listing)

    if is_supabase_live:
        try:
            from supabase import create_client
            client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
            client.table("listings").insert(new_listing).execute()
        except Exception:
            pass

    return new_listing

@app.patch("/api/listings/{listing_id}/archive")
async def archive_listing(listing_id: str, archived: bool = Query(True), user: AuthenticatedUser = Depends(get_current_user)):
    for l in FALLBACK_LISTINGS:
        if l["id"] == listing_id:
            l["archived"] = archived
            return l
    raise HTTPException(status_code=404, detail="Listing not found")


# 4. Orders & Handover Endpoints
@app.get("/api/orders")
async def get_orders(user: AuthenticatedUser = Depends(get_current_user)):
    return FALLBACK_ORDERS

@app.post("/api/orders")
async def create_order(payload: OrderCreatePayload, user: AuthenticatedUser = Depends(get_current_user)):
    # Idempotency check using request_id
    if payload.request_id and payload.request_id in FALLBACK_REQUESTS:
        existing_id = FALLBACK_REQUESTS[payload.request_id]
        existing = next((o for o in FALLBACK_ORDERS if o["id"] == existing_id), None)
        if existing:
            return existing

    listing = next((l for l in FALLBACK_LISTINGS if l["id"] == payload.listing_id), None)
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")

    if listing["quantity"] < payload.quantity:
        raise HTTPException(status_code=400, detail="Insufficient stock available")

    order_id = f"ord-{uuid.uuid4()}"
    unit_price = 0.0 if listing["mode"] == "Donate" else (listing["price"] * (payload.days or 1) if listing["mode"] == "Rent" else listing["price"])
    total_amount = unit_price * payload.quantity

    new_order = {
        "id": order_id,
        "listing_id": listing["id"],
        "buyer_id": user.id,
        "seller_id": listing.get("seller_id", "demo-seller"),
        "name": listing["name"],
        "mode": listing["mode"],
        "quantity": payload.quantity,
        "days": payload.days or 1,
        "amount": total_amount,
        "buyer_confirmed": False,
        "seller_confirmed": False,
        "status": "Ready for Handover",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    FALLBACK_ORDERS.insert(0, new_order)

    if payload.request_id:
        FALLBACK_REQUESTS[payload.request_id] = order_id

    return new_order

@app.post("/api/orders/{order_id}/confirm")
async def confirm_order(order_id: str, user: AuthenticatedUser = Depends(get_current_user)):
    order = next((o for o in FALLBACK_ORDERS if o["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order["status"] == "Completed":
        return order

    # Record confirmation based on actor
    if user.id == order.get("buyer_id"):
        order["buyer_confirmed"] = True
    if user.id == order.get("seller_id"):
        order["seller_confirmed"] = True
    if user.id != order.get("buyer_id") and user.id != order.get("seller_id"):
        # Demo simulation: confirm both
        order["buyer_confirmed"] = True
        order["seller_confirmed"] = True

    # Check dual confirmation
    if order["buyer_confirmed"] and order["seller_confirmed"]:
        order["status"] = "Completed"

        # Decrement listing stock
        listing = next((l for l in FALLBACK_LISTINGS if l["id"] == order["listing_id"]), None)
        if listing:
            listing["quantity"] = max(0, listing["quantity"] - order["quantity"])
            if listing["quantity"] == 0:
                listing["archived"] = True

            # Log empirical mass reuse
            reused_grams = (listing.get("weight_g") or 50.0) * order["quantity"]
            FALLBACK_IMPACT.append({
                "id": f"imp-{uuid.uuid4()}",
                "user_id": order["buyer_id"],
                "source_id": order["id"],
                "reuse_g": reused_grams,
                "source": "order_completion"
            })

    return order

@app.post("/api/orders/{order_id}/cancel")
async def cancel_order(order_id: str, user: AuthenticatedUser = Depends(get_current_user)):
    order = next((o for o in FALLBACK_ORDERS if o["id"] == order_id), None)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    order["status"] = "Cancelled"
    return order


# 5. Impact Endpoints
@app.get("/api/impact")
async def get_impact():
    return FALLBACK_IMPACT


# 6. E-Waste Submissions
@app.post("/api/ewaste")
async def submit_ewaste(payload: EWastePayload, user: AuthenticatedUser = Depends(get_current_user)):
    if payload.weight_g and payload.weight_g < 100:
        raise HTTPException(status_code=400, detail="Minimum e-waste weight for intake is 100 grams.")

    submission = {
        "id": f"ew-{uuid.uuid4()}",
        "user_id": user.id,
        "route": payload.route,
        "weight_g": payload.weight_g or 500.0,
        "media_path": payload.media_path,
        "quoted_rate_per_kg": payload.quoted_rate_per_kg or 0.0,
        "quote_source": payload.quote_source,
        "status": "Submitted",
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    FALLBACK_EWASTE.append(submission)

    return submission


# 7. AI Endpoints (Gemini with Robust Fallback)
@app.post("/api/ai/analyze-component")
async def analyze_component(payload: AIAnalyzePayload):
    # If Gemini API key is configured and valid, call Gemini 1.5 Flash
    if GEMINI_API_KEY and "your-gemini" not in GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel(GEMINI_MODEL)

            prompt = """Analyze this electronics component.
Return ONLY a JSON object with:
"probable_name": string (e.g. ESP32 DevKit V1),
"category": string (e.g. Microcontrollers, Sensors, Actuators),
"visible_condition": string (e.g. Used — working, seller reported),
"confidence": float between 0.0 and 1.0.
Output only raw JSON, no code fences."""

            response = model.generate_content(prompt)
            clean_text = re.sub(r'```json|```', '', response.text).strip()
            import json
            return json.loads(clean_text)
        except Exception:
            pass

    # Deterministic fallback response
    return {
        "probable_name": "ESP32 DevKit V1 30-Pin NodeMCU",
        "category": "Microcontrollers",
        "visible_condition": "Used — working, seller reported",
        "confidence": 0.92
    }

@app.post("/api/ai/generate-listing")
async def generate_listing(payload: AIGeneratePayload):
    comp = payload.component or {}
    name = comp.get("component") or "Microcontroller Module"
    cat = comp.get("category") or "Microcontrollers"

    if GEMINI_API_KEY and "your-gemini" not in GEMINI_API_KEY:
        try:
            import google.generativeai as genai
            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel(GEMINI_MODEL)

            prompt = f"""Write an informative DIY circular reuse marketplace listing for: {name} (Category: {cat}).
Return ONLY valid JSON with keys:
"title": string,
"description": string,
"tags": array of strings,
"possible_applications": array of strings,
"search_keywords": array of strings.
Output strictly JSON without markdown."""

            response = model.generate_content(prompt)
            clean_text = re.sub(r'```json|```', '', response.text).strip()
            import json
            return json.loads(clean_text)
        except Exception:
            pass

    return {
        "title": f"Tested {name} for DIY Prototyping",
        "description": f"Salvaged and verified {name}. Ideal for circular electronics hardware projects, STEM education, and smart sensor hubs.",
        "tags": [cat.lower(), "salvaged", "circular", "maker"],
        "possible_applications": ["Smart Agriculture", "Robotics Rover", "IoT Weather Hub"],
        "search_keywords": [name.lower(), cat.lower(), "arduino", "esp32"]
    }

@app.post("/api/ai/chat")
async def ai_chat(payload: AIChatPayload):
    msg = payload.message.lower().strip()

    # Grounded RAG search over curated knowledge
    matched_sources = []
    for k in KNOWLEDGE_BASE:
        if any(term in k["content"].lower() or term in k["title"].lower() for term in msg.split()):
            matched_sources.append(k["title"])

    reply = ""
    if "safe" in msg or "certif" in msg:
        reply = "Circuit Safety Note: AI cannot certify electrical safety or hardware authenticity. Always inspect pins and test salvaged boards with a current-limited bench supply or multimeter before powering sensitive circuits."
    elif "irrigation" in msg or "plant" in msg:
        reply = "For the Smart Plant Irrigation System, you need an ESP32 or Arduino Uno, Soil Moisture Sensor, 5V Relay, and a Mini Water Pump. You can source missing parts in the Marketplace tab."
    elif "handover" in msg or "confirm" in msg:
        reply = "To complete an exchange safely, both the buyer and seller verify the handover. Once confirmed, payment escrow is released and empirical reuse mass is added to the circular sustainability ledger."
    elif "ewaste" in msg or "recycle" in msg:
        reply = "Items that cannot be salvaged are routed to certified recycling partners. Ensure you declare items accurately so hazardous heavy metals are safely diverted."
    else:
        reply = f"Hello Maker! I can help you identify components, check bill of materials (BOM) compatibility, and guide you through safe circular handovers. What project are you building today?"

    return {
        "reply": reply,
        "sources": matched_sources or ["ReCircuit Circular Guidelines"]
    }
