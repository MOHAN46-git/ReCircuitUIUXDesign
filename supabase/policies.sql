-- ReCircuit Row Level Security (RLS) Policies
-- Enforce strict role-based access, least privilege, and participant boundaries

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE component_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_demo ENABLE ROW LEVEL SECURITY;
ALTER TABLE handover_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE ewaste_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE impact_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
-- Public can read basic profile info (avatar, first_name)
CREATE POLICY "Public profiles are viewable by everyone" 
ON profiles FOR SELECT USING (true);

-- Users can update only their own profile
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Component Catalog Policies
-- Anyone can view catalog
CREATE POLICY "Component catalog is viewable by all" 
ON component_catalog FOR SELECT USING (true);

-- Only authenticated users or admins can suggest components
CREATE POLICY "Authenticated users can insert components" 
ON component_catalog FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 3. Listings Policies
-- Anyone can view active listings
CREATE POLICY "Active listings are viewable by everyone" 
ON listings FOR SELECT USING (status = 'active' OR auth.uid() = seller_id);

-- Sellers can insert their own listings
CREATE POLICY "Sellers can create listings" 
ON listings FOR INSERT WITH CHECK (auth.uid() = seller_id);

-- Sellers can update their own listings
CREATE POLICY "Sellers can update own listings" 
ON listings FOR UPDATE USING (auth.uid() = seller_id);

-- 4. Listing Media Policies
CREATE POLICY "Listing media viewable by everyone" 
ON listing_media FOR SELECT USING (true);

CREATE POLICY "Sellers can add media to own listings" 
ON listing_media FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND seller_id = auth.uid())
);

-- 5. Projects & Requirements Policies
CREATE POLICY "Projects viewable by everyone" 
ON projects FOR SELECT USING (true);

CREATE POLICY "Project requirements viewable by everyone" 
ON project_requirements FOR SELECT USING (true);

-- 6. User Inventory Policies
CREATE POLICY "Users can manage own inventory" 
ON user_inventory FOR ALL USING (auth.uid() = user_id);

-- 7. Orders Policies
-- Participants (buyer or seller) can view the order
CREATE POLICY "Participants can view orders" 
ON orders FOR SELECT USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Buyers can create orders for active listings
CREATE POLICY "Buyers can create orders" 
ON orders FOR INSERT WITH CHECK (
    auth.uid() = buyer_id AND 
    EXISTS (SELECT 1 FROM listings WHERE id = listing_id AND status = 'active')
);

-- 8. Payment Demo Policies
CREATE POLICY "Order participants can view demo payment" 
ON payment_demo FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
);

-- 9. Handover Verifications Policies
-- Handover records viewable only by buyer or seller
CREATE POLICY "Order participants can view handover status" 
ON handover_verifications FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE id = order_id AND (buyer_id = auth.uid() OR seller_id = auth.uid()))
);

-- 10. E-Waste Submissions Policies
CREATE POLICY "Users can manage own ewaste submissions" 
ON ewaste_submissions FOR ALL USING (auth.uid() = user_id);

-- 11. Impact Events Policies
CREATE POLICY "Impact events viewable by everyone for global transparency" 
ON impact_events FOR SELECT USING (true);

CREATE POLICY "Users can view own detailed impact" 
ON impact_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 12. AI Analyses Policies
CREATE POLICY "Users can view own AI analyses" 
ON ai_analyses FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can save own AI analyses" 
ON ai_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 13. Audit Logs Policies
CREATE POLICY "Actors can view own audit logs" 
ON audit_logs FOR SELECT USING (auth.uid() = actor_id);
