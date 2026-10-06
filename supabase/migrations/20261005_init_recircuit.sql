-- ReCircuit Database Schema Initial Migration
-- Circular Electronics Reuse & Project-Matching Platform

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'institution', 'admin');
CREATE TYPE listing_mode AS ENUM ('sell', 'rent', 'donate');
CREATE TYPE listing_status AS ENUM ('active', 'reserved', 'sold_out', 'archived');
CREATE TYPE component_condition AS ENUM ('new', 'like_new', 'used_functional', 'untested', 'for_parts');
CREATE TYPE order_type AS ENUM ('buy', 'rent', 'donate');
CREATE TYPE order_status AS ENUM ('reserved', 'payment_held_demo', 'ready_for_handover', 'completed', 'cancelled', 'review');
CREATE TYPE payment_state AS ENUM ('created', 'held_demo', 'released_demo', 'refunded_demo');
CREATE TYPE verification_status AS ENUM ('unverified', 'demo_verified', 'verified');
CREATE TYPE ewaste_route AS ENUM ('recycling_partner_demo', 'component_harvesting', 'community_collection');
CREATE TYPE ewaste_status AS ENUM ('submitted', 'scheduled_pickup', 'received', 'processed');

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role DEFAULT 'buyer' NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    avatar_url TEXT,
    phone TEXT,
    organization TEXT,
    verification_status verification_status DEFAULT 'unverified' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 2. Component Catalog
CREATE TABLE IF NOT EXISTS component_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    canonical_name TEXT NOT NULL UNIQUE,
    aliases TEXT[] DEFAULT '{}' NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    default_mass_g NUMERIC(10, 2) NOT NULL DEFAULT 50.0,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Listings Table
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    component_id UUID REFERENCES component_catalog(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    condition component_condition NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    mode listing_mode NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0.0 CHECK (price >= 0),
    rent_per_day NUMERIC(10, 2) DEFAULT 0.0 CHECK (rent_per_day >= 0),
    status listing_status DEFAULT 'active' NOT NULL,
    mass_g NUMERIC(10, 2) NOT NULL CHECK (mass_g > 0),
    tags TEXT[] DEFAULT '{}' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Listing Media Table
CREATE TABLE IF NOT EXISTS listing_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    path TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image/jpeg',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced')),
    category TEXT NOT NULL,
    estimated_reuse_g NUMERIC(10, 2) NOT NULL DEFAULT 100.0 CHECK (estimated_reuse_g >= 0),
    image_url TEXT,
    instructions TEXT,
    status TEXT DEFAULT 'active' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Project Requirements (BOM)
CREATE TABLE IF NOT EXISTS project_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES component_catalog(id) ON DELETE CASCADE,
    required_qty INTEGER NOT NULL CHECK (required_qty > 0),
    critical BOOLEAN DEFAULT TRUE NOT NULL,
    weight NUMERIC(4, 2) DEFAULT 1.0 NOT NULL,
    UNIQUE(project_id, component_id)
);

-- 7. User Inventory (Owned or listable components)
CREATE TABLE IF NOT EXISTS user_inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES component_catalog(id) ON DELETE CASCADE,
    qty INTEGER NOT NULL CHECK (qty >= 0),
    source TEXT DEFAULT 'manual' NOT NULL,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    UNIQUE(user_id, component_id)
);

-- 8. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE RESTRICT,
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    seller_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    qty INTEGER NOT NULL CHECK (qty > 0),
    type order_type NOT NULL,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.0 CHECK (amount >= 0),
    status order_status DEFAULT 'reserved' NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. Payment Demo Simulation
CREATE TABLE IF NOT EXISTS payment_demo (
    order_id UUID PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
    state payment_state DEFAULT 'held_demo' NOT NULL,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    held_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    released_at TIMESTAMPTZ
);

-- 10. Handover Verifications
CREATE TABLE IF NOT EXISTS handover_verifications (
    order_id UUID PRIMARY KEY REFERENCES orders(id) ON DELETE CASCADE,
    buyer_hash TEXT NOT NULL,
    seller_hash TEXT NOT NULL,
    buyer_verified_at TIMESTAMPTZ,
    seller_verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. E-Waste Submissions
CREATE TABLE IF NOT EXISTS ewaste_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    weight_g NUMERIC(10, 2) NOT NULL CHECK (weight_g >= 100),
    route ewaste_route NOT NULL,
    estimated_value NUMERIC(10, 2) DEFAULT 0.0,
    status ewaste_status DEFAULT 'submitted' NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. Impact Events (Waste Diversion & Reusability)
CREATE TABLE IF NOT EXISTS impact_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    source_type TEXT NOT NULL, -- 'order_completion', 'ewaste_recycle', 'project_built'
    source_id UUID,
    reuse_g NUMERIC(10, 2) DEFAULT 0.0 NOT NULL,
    recycle_g NUMERIC(10, 2) DEFAULT 0.0 NOT NULL,
    savings_estimate NUMERIC(10, 2) DEFAULT 0.0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. AI Analyses (Audit & Cache)
CREATE TABLE IF NOT EXISTS ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES listings(id) ON DELETE SET NULL,
    type TEXT NOT NULL, -- 'component_vision', 'listing_copilot', 'intent_search'
    model TEXT NOT NULL,
    result_json JSONB NOT NULL,
    confidence NUMERIC(3, 2),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 14. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    action TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_seller ON listings(seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings(status);
CREATE INDEX IF NOT EXISTS idx_listings_component ON listings(component_id);
CREATE INDEX IF NOT EXISTS idx_project_requirements_project ON project_requirements(project_id);
CREATE INDEX IF NOT EXISTS idx_user_inventory_user ON user_inventory(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_buyer ON orders(buyer_id);
CREATE INDEX IF NOT EXISTS idx_orders_seller ON orders(seller_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_impact_events_user ON impact_events(user_id);

-- Atomic Order Completion RPC Function
CREATE OR REPLACE FUNCTION complete_order_atomic(
    p_order_id UUID,
    p_actor_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order RECORD;
    v_listing RECORD;
    v_new_qty INTEGER;
    v_reuse_mass NUMERIC(10, 2);
BEGIN
    -- 1. Fetch and lock order
    SELECT * INTO v_order
    FROM orders
    WHERE id = p_order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    IF v_order.status = 'completed' THEN
        RETURN jsonb_build_object('success', true, 'message', 'Order already completed');
    END IF;

    -- 2. Fetch and lock listing
    SELECT * INTO v_listing
    FROM listings
    WHERE id = v_order.listing_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Listing not found';
    END IF;

    IF v_listing.quantity < v_order.qty THEN
        RAISE EXCEPTION 'Insufficient stock remaining to complete order';
    END IF;

    -- 3. Calculate new quantity and update listing
    v_new_qty := v_listing.quantity - v_order.qty;
    UPDATE listings
    SET 
        quantity = v_new_qty,
        status = CASE WHEN v_new_qty = 0 THEN 'sold_out'::listing_status ELSE status END,
        updated_at = NOW()
    WHERE id = v_listing.id;

    -- 4. Update order status
    UPDATE orders
    SET 
        status = 'completed',
        updated_at = NOW()
    WHERE id = p_order_id;

    -- 5. Release demo payment
    UPDATE payment_demo
    SET 
        state = 'released_demo',
        released_at = NOW()
    WHERE order_id = p_order_id;

    -- 6. Calculate reused mass and insert impact event
    v_reuse_mass := v_listing.mass_g * v_order.qty;
    INSERT INTO impact_events (user_id, source_type, source_id, reuse_g, recycle_g, savings_estimate)
    VALUES (v_order.buyer_id, 'order_completion', p_order_id, v_reuse_mass, 0, v_order.amount);

    -- 7. Log audit event
    INSERT INTO audit_logs (actor_id, entity_type, entity_id, action, metadata)
    VALUES (p_actor_id, 'orders', p_order_id, 'order_completed', jsonb_build_object('listing_id', v_listing.id, 'qty', v_order.qty, 'remaining_stock', v_new_qty, 'mass_g', v_reuse_mass));

    RETURN jsonb_build_object(
        'success', true, 
        'order_id', p_order_id,
        'remaining_stock', v_new_qty,
        'mass_reused_g', v_reuse_mass
    );
END;
$$;
