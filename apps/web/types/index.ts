// Central TypeScript definitions for ReCircuit Platform
// Circular Electronics Reuse & Project-Matching Platform

export type UserRole = 'buyer' | 'seller' | 'institution' | 'admin';
export type ListingMode = 'sell' | 'rent' | 'donate';
export type ListingStatus = 'active' | 'reserved' | 'sold_out' | 'archived';
export type Condition = 'new' | 'like_new' | 'used_functional' | 'untested' | 'for_parts';
export type OrderType = 'buy' | 'rent' | 'donate';
export type OrderStatus = 'reserved' | 'payment_held_demo' | 'ready_for_handover' | 'completed' | 'cancelled' | 'review';
export type PaymentDemoState = 'created' | 'held_demo' | 'released_demo' | 'refunded_demo';
export type VerificationStatus = 'unverified' | 'demo_verified' | 'verified';
export type EWasteRoute = 'recycling_partner_demo' | 'component_harvesting' | 'community_collection';
export type EWasteStatus = 'submitted' | 'scheduled_pickup' | 'received' | 'processed';

export interface Profile {
  id: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  email?: string;
  avatar_url?: string;
  phone?: string;
  organization?: string;
  verification_status: VerificationStatus;
  created_at: string;
  updated_at?: string;
}

export interface ComponentCatalogItem {
  id: string;
  canonical_name: string;
  aliases: string[];
  category: string;
  description?: string;
  default_mass_g: number;
}

export interface Listing {
  id: string;
  seller_id: string;
  seller?: Profile;
  component_id?: string;
  component?: ComponentCatalogItem;
  title: string;
  description: string;
  condition: Condition;
  quantity: number;
  mode: ListingMode;
  price: number;
  rent_per_day: number;
  status: ListingStatus;
  mass_g: number;
  tags: string[];
  image_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface ProjectRequirement {
  id: string;
  project_id: string;
  component_id: string;
  component?: ComponentCatalogItem;
  required_qty: number;
  critical: boolean;
  weight: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  estimated_reuse_g: number;
  image_url?: string;
  instructions?: string;
  status: string;
  requirements?: ProjectRequirement[];
}

export interface UserInventoryItem {
  id: string;
  user_id: string;
  component_id: string;
  component?: ComponentCatalogItem;
  qty: number;
  source: string;
  listing_id?: string;
}

export interface Order {
  id: string;
  listing_id: string;
  listing?: Listing;
  buyer_id: string;
  buyer?: Profile;
  seller_id: string;
  seller?: Profile;
  qty: number;
  type: OrderType;
  amount: number;
  status: OrderStatus;
  created_at: string;
  updated_at?: string;
  payment_demo?: PaymentDemo;
  handover?: HandoverVerification;
}

export interface PaymentDemo {
  order_id: string;
  state: PaymentDemoState;
  amount: number;
  held_at: string;
  released_at?: string;
}

export interface HandoverVerification {
  order_id: string;
  buyer_hash: string;
  seller_hash: string;
  buyer_verified_at?: string;
  seller_verified_at?: string;
  expires_at: string;
}

export interface EWasteSubmission {
  id: string;
  user_id: string;
  category: string;
  weight_g: number;
  route: EWasteRoute;
  estimated_value: number;
  status: EWasteStatus;
  notes?: string;
  created_at: string;
}

export interface ImpactEvent {
  id: string;
  user_id: string;
  source_type: string;
  source_id?: string;
  reuse_g: number;
  recycle_g: number;
  savings_estimate: number;
  created_at: string;
}

export interface AIAnalysisResult {
  probable_name: string;
  category: string;
  possible_model?: string;
  visible_condition: 'new' | 'like_new' | 'used_functional' | 'untested' | 'for_parts';
  observations: string[];
  suggested_tags: string[];
  confidence: number; // 0.0 - 1.0
  safety_warning?: string | null;
}

// Feasibility & BOM Types
export interface BOMItemMatch {
  component_id: string;
  canonical_name: string;
  category: string;
  required_qty: number;
  available_qty: number;
  missing_qty: number;
  status: 'HAVE' | 'PARTIAL' | 'MISSING';
  critical: boolean;
  weight: number;
  default_mass_g: number;
  marketplace_listings?: Listing[];
}

export interface ProjectFeasibility {
  project_id: string;
  project: Project;
  score: number; // 0 - 100 deterministic formula
  weighted_score: number;
  matched_items_count: number;
  total_items_count: number;
  is_buildable: boolean;
  reusable_mass_g: number;
  boms: BOMItemMatch[];
  missing_items: BOMItemMatch[];
}
