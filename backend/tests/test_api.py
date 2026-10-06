from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "service" in data

def test_profile_flow():
    # Test GET profile
    res = client.get("/api/profile", headers={"Authorization": "Bearer demo-token"})
    assert res.status_code == 200
    profiles = res.json()
    assert isinstance(profiles, list)

    # Test POST profile
    res = client.post("/api/profile", json={"name": "Test Maker", "role": "seller", "details": {"mobile": "+91 9999999999"}}, headers={"Authorization": "Bearer demo-token"})
    assert res.status_code == 200
    assert res.json()["name"] == "Test Maker"

def test_listings_and_order_flow():
    # Create listing
    listing_payload = {
        "name": "Tested Microcontroller",
        "quantity": 2,
        "mode": "Sell",
        "price": 300.0,
        "condition": "Used — working, seller reported",
        "weight_g": 40.0,
        "metadata": {"category": "Microcontrollers"}
    }
    create_res = client.post("/api/listings", json=listing_payload, headers={"Authorization": "Bearer demo-token"})
    assert create_res.status_code == 200
    listing = create_res.json()
    listing_id = listing["id"]
    assert listing["quantity"] == 2

    # Place order with idempotency request_id
    order_payload = {
        "listing_id": listing_id,
        "quantity": 1,
        "days": 1,
        "request_id": "test-req-12345"
    }
    order_res = client.post("/api/orders", json=order_payload, headers={"Authorization": "Bearer demo-token"})
    assert order_res.status_code == 200
    order = order_res.json()
    order_id = order["id"]
    assert order["status"] == "Ready for Handover"

    # Idempotent repeat request
    repeat_res = client.post("/api/orders", json=order_payload, headers={"Authorization": "Bearer demo-token"})
    assert repeat_res.status_code == 200
    assert repeat_res.json()["id"] == order_id

    # Confirm order
    confirm_res = client.post(f"/api/orders/{order_id}/confirm", headers={"Authorization": "Bearer demo-token"})
    assert confirm_res.status_code == 200
    assert confirm_res.json()["status"] == "Completed"

def test_ai_analyze_fallback():
    res = client.post("/api/ai/analyze-component", json={"image": "data:image/jpeg;base64,sample"})
    assert res.status_code == 200
    data = res.json()
    assert "probable_name" in data
    assert "confidence" in data

def test_ai_chat_rag():
    res = client.post("/api/ai/chat", json={"message": "What parts do I need for Smart Plant Irrigation?"})
    assert res.status_code == 200
    data = res.json()
    assert "reply" in data
    assert "sources" in data
    assert len(data["sources"]) > 0

def test_ewaste_validation():
    # Weight < 100g should be rejected
    res = client.post("/api/ewaste", json={"route": "Certified Recycler", "weight_g": 50}, headers={"Authorization": "Bearer demo-token"})
    assert res.status_code == 400

    # Weight >= 100g should succeed
    res = client.post("/api/ewaste", json={"route": "Certified Recycler", "weight_g": 400}, headers={"Authorization": "Bearer demo-token"})
    assert res.status_code == 200
    assert res.json()["status"] == "Submitted"
