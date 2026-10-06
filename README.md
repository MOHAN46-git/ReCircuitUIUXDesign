# ReCircuit — AI-Powered Circular Electronics Reuse & Project-Matching Platform

> Turning salvaged components, classroom surplus, and e-waste into functional DIY projects with deterministic Bill of Materials matching.

---

## 🚀 Key Features

1. **Deterministic Feasibility Matching Engine**:
   - Cross-references user inventory with canonical project BOM requirements using the exact mathematical formula:
     $$\text{Score} = 100 \times \frac{\sum \min(\text{available}_i, \text{required}_i)}{\sum \text{required}_i}$$
   - Displays exact percentage gauges, itemized availability (HAVE / PARTIAL / MISSING), and direct "Find in Market" links for missing parts.

2. **5-Step Component Scanner & Listing Stepper**:
   - Stepper: `Media` → `AI Scan` → `Confirm Identity` → `Mode & Price` → `Publish`.
   - Optical inspection suggests probable name, category, model, and visible condition with realistic confidence scores.
   - Fully editable with strict safety disclaimers (*"AI suggestion—not safety certification"*).

3. **Circular Marketplace & Intent Search**:
   - Supports Buy Used, Rent, and Free Student Donations.
   - AI Intent Expansion: searching queries like `"RC drone"` expands automatically to `motor`, `esc`, `battery`, `imu`, `controller`.

4. **Dual-Confirmation Handover Ledger**:
   - Simulated demo escrow (`CREATED` → `HELD_DEMO` → `READY_FOR_HANDOVER` → `RELEASED_DEMO`).
   - Requires 4-digit code confirmation from both parties to atomically decrement stock, prevent race conditions, and log diversion mass.

5. **Empirical E-Waste & Sustainability Dashboard**:
   - 100% mass-measured metrics: records physical gram mass of every reused part.
   - Calculates kilograms diverted from landfills, projects enabled, and avoided $\text{CO}_2$ equivalents.
   - Reuse-first circular e-waste intake router.

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide Icons.
- **Backend**: Next.js Route Handlers, Zod Validation Schemas, Domain Service Layer.
- **Database & Auth**: Supabase PostgreSQL, Row Level Security (RLS) policies, and Atomic RPC Functions (`recircuit/supabase/`).
- **Resilience**: Dual-mode storage adapter (uses live Supabase when env vars are present; seamlessly falls back to pre-seeded local storage/in-memory provider for zero-configuration testing).
- **AI Layer**: Server-side Provider abstraction with Gemini integration and deterministic offline fallback.

---

## 🏁 Quickstart

### 1. Install & Run Locally

```bash
cd recircuit/apps/web
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Run Unit Tests

```bash
cd recircuit/apps/web
node --test tests/unit/matching.test.mjs
```

### 3. Production Build Check

```bash
cd recircuit/apps/web
npm run build
```

---

## 👥 Demo Personas (One-Click Switcher)

Switch personas anytime using the user badge in the navigation bar:
- **Vikram Patel** (`Buyer / Student`): Owns an ESP32, Soil Sensor, 5V Relay, and Breadboard (80% match for Smart Irrigation).
- **Priya Sharma** (`Seller / Maker`): GreenCircuit Makerspace coordinator with active surplus listings.
- **Dr. Ramesh Sundaram** (`Institution / Lab Coordinator`): Donates college surplus boards and motor shields.
