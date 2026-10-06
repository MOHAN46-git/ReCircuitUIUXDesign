-- ============================================================================
-- ReCircuit Master Backend Schema & Security Policies (Migration 001_backend.sql)
-- Circular Electronics Reuse & Project-Matching Platform
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Enums
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'institution', 'both', 'admin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE listing_mode AS ENUM ('Sell', 'Rent', 'Donate');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE component_condition AS ENUM ('Used — working, seller reported', 'Untested', 'For parts');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE order_status AS ENUM ('Ready for Handover', 'Completed', 'Cancelled');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2. Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'buyer',
    details JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. Listings Table
CREATE TABLE IF NOT EXISTS listings (
    id TEXT PRIMARY KEY,
    seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity >= 0),
    mode TEXT NOT NULL,
    price NUMERIC(10, 2) DEFAULT 0.0 CHECK (price >= 0),
    condition TEXT NOT NULL,
    archived BOOLEAN DEFAULT FALSE NOT NULL,
    weight_g NUMERIC(10, 2) DEFAULT 50.0 CHECK (weight_g >= 0),
    max_days INTEGER,
    deposit NUMERIC(10, 2) DEFAULT 0.0,
    metadata JSONB DEFAULT '{}'::jsonb NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    listing_id TEXT REFERENCES listings(id) ON DELETE RESTRICT,
    buyer_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
    seller_id UUID REFERENCES auth.users(id) ON DELETE RESTRICT,
    name TEXT NOT NULL,
    mode TEXT NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    days INTEGER DEFAULT 1,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 0.0,
    buyer_confirmed BOOLEAN DEFAULT FALSE NOT NULL,
    seller_confirmed BOOLEAN DEFAULT FALSE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Ready for Handover',
    request_id UUID UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. Impact Events Table
CREATE TABLE IF NOT EXISTS impact_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    source_id TEXT,
    source_type TEXT NOT NULL,
    reuse_g NUMERIC(10, 2) DEFAULT 0.0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. E-Waste Submissions
CREATE TABLE IF NOT EXISTS ewaste_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    route TEXT NOT NULL,
    weight_g NUMERIC(10, 2) CHECK (weight_g >= 100),
    media_path TEXT,
    quoted_rate_per_kg NUMERIC(10, 2),
    quote_source TEXT,
    status TEXT NOT NULL DEFAULT 'Submitted',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. Knowledge Base Table (For Grounded RAG)
CREATE TABLE IF NOT EXISTS application_knowledge (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL,
    tsv TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || content)) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_knowledge_tsv ON application_knowledge USING GIN(tsv);

-- 8. Storage bucket configuration for component media
INSERT INTO storage.buckets (id, name, public) 
VALUES ('component-media', 'component-media', true)
ON CONFLICT (id) DO NOTHING;

-- 9. Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ewaste_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_knowledge ENABLE ROW LEVEL SECURITY;

-- 10. RLS Policies
DROP POLICY IF EXISTS "Profiles are public read" ON profiles;
CREATE POLICY "Profiles are public read" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Listings are viewable by all" ON listings;
CREATE POLICY "Listings are viewable by all" ON listings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Sellers can manage own listings" ON listings;
CREATE POLICY "Sellers can manage own listings" ON listings FOR ALL USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Participants can view orders" ON orders;
CREATE POLICY "Participants can view orders" ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Buyers can create orders" ON orders;
CREATE POLICY "Buyers can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Participants can update orders" ON orders;
CREATE POLICY "Participants can update orders" ON orders FOR UPDATE USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

DROP POLICY IF EXISTS "Impact events are viewable by all" ON impact_events;
CREATE POLICY "Impact events are viewable by all" ON impact_events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can manage own ewaste" ON ewaste_submissions;
CREATE POLICY "Users can manage own ewaste" ON ewaste_submissions FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Knowledge base is viewable by all" ON application_knowledge;
CREATE POLICY "Knowledge base is viewable by all" ON application_knowledge FOR SELECT USING (true);

DROP POLICY IF EXISTS "Component media public read" ON storage.objects;
CREATE POLICY "Component media public read" ON storage.objects FOR SELECT USING (bucket_id = 'component-media');

DROP POLICY IF EXISTS "Authenticated users can upload media" ON storage.objects;
CREATE POLICY "Authenticated users can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'component-media' AND auth.role() = 'authenticated');
