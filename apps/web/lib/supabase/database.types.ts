export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'buyer' | 'seller' | 'institution' | 'admin';
          first_name: string;
          last_name: string;
          email: string | null;
          avatar_url: string | null;
          phone: string | null;
          organization: string | null;
          verification_status: 'unverified' | 'demo_verified' | 'verified';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: 'buyer' | 'seller' | 'institution' | 'admin';
          first_name: string;
          last_name: string;
          email?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          organization?: string | null;
          verification_status?: 'unverified' | 'demo_verified' | 'verified';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: 'buyer' | 'seller' | 'institution' | 'admin';
          first_name?: string;
          last_name?: string;
          email?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          organization?: string | null;
          verification_status?: 'unverified' | 'demo_verified' | 'verified';
          created_at?: string;
          updated_at?: string;
        };
      };
      component_catalog: {
        Row: {
          id: string;
          canonical_name: string;
          aliases: string[];
          category: string;
          description: string | null;
          default_mass_g: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          canonical_name: string;
          aliases?: string[];
          category: string;
          description?: string | null;
          default_mass_g?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          canonical_name?: string;
          aliases?: string[];
          category?: string;
          description?: string | null;
          default_mass_g?: number;
          created_at?: string;
        };
      };
      listings: {
        Row: {
          id: string;
          seller_id: string;
          component_id: string | null;
          title: string;
          description: string;
          condition: 'new' | 'like_new' | 'used_functional' | 'untested' | 'for_parts';
          quantity: number;
          mode: 'sell' | 'rent' | 'donate';
          price: number;
          rent_per_day: number;
          status: 'active' | 'reserved' | 'sold_out' | 'archived';
          mass_g: number;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          seller_id: string;
          component_id?: string | null;
          title: string;
          description: string;
          condition: 'new' | 'like_new' | 'used_functional' | 'untested' | 'for_parts';
          quantity: number;
          mode: 'sell' | 'rent' | 'donate';
          price?: number;
          rent_per_day?: number;
          status?: 'active' | 'reserved' | 'sold_out' | 'archived';
          mass_g: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          seller_id?: string;
          component_id?: string | null;
          title?: string;
          description?: string;
          condition?: 'new' | 'like_new' | 'used_functional' | 'untested' | 'for_parts';
          quantity?: number;
          mode?: 'sell' | 'rent' | 'donate';
          price?: number;
          rent_per_day?: number;
          status?: 'active' | 'reserved' | 'sold_out' | 'archived';
          mass_g?: number;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      listing_media: {
        Row: {
          id: string;
          listing_id: string;
          path: string;
          media_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          path: string;
          media_type?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          path?: string;
          media_type?: string;
          created_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          description: string;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
          category: string;
          estimated_reuse_g: number;
          image_url: string | null;
          instructions: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          description: string;
          difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
          category: string;
          estimated_reuse_g?: number;
          image_url?: string | null;
          instructions?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          description?: string;
          difficulty?: 'Beginner' | 'Intermediate' | 'Advanced';
          category?: string;
          estimated_reuse_g?: number;
          image_url?: string | null;
          instructions?: string | null;
          status?: string;
          created_at?: string;
        };
      };
      project_requirements: {
        Row: {
          id: string;
          project_id: string;
          component_id: string;
          required_qty: number;
          critical: boolean;
          weight: number;
        };
        Insert: {
          id?: string;
          project_id: string;
          component_id: string;
          required_qty: number;
          critical?: boolean;
          weight?: number;
        };
        Update: {
          id?: string;
          project_id?: string;
          component_id?: string;
          required_qty?: number;
          critical?: boolean;
          weight?: number;
        };
      };
      user_inventory: {
        Row: {
          id: string;
          user_id: string;
          component_id: string;
          qty: number;
          source: string;
          listing_id: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          component_id: string;
          qty: number;
          source?: string;
          listing_id?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          component_id?: string;
          qty?: number;
          source?: string;
          listing_id?: string | null;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          qty: number;
          type: 'buy' | 'rent' | 'donate';
          amount: number;
          status: 'reserved' | 'payment_held_demo' | 'ready_for_handover' | 'completed' | 'cancelled' | 'review';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          listing_id: string;
          buyer_id: string;
          seller_id: string;
          qty: number;
          type: 'buy' | 'rent' | 'donate';
          amount?: number;
          status?: 'reserved' | 'payment_held_demo' | 'ready_for_handover' | 'completed' | 'cancelled' | 'review';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string;
          buyer_id?: string;
          seller_id?: string;
          qty?: number;
          type?: 'buy' | 'rent' | 'donate';
          amount?: number;
          status?: 'reserved' | 'payment_held_demo' | 'ready_for_handover' | 'completed' | 'cancelled' | 'review';
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_demo: {
        Row: {
          order_id: string;
          state: 'created' | 'held_demo' | 'released_demo' | 'refunded_demo';
          amount: number;
          held_at: string;
          released_at: string | null;
        };
        Insert: {
          order_id: string;
          state?: 'created' | 'held_demo' | 'released_demo' | 'refunded_demo';
          amount: number;
          held_at?: string;
          released_at?: string | null;
        };
        Update: {
          order_id?: string;
          state?: 'created' | 'held_demo' | 'released_demo' | 'refunded_demo';
          amount?: number;
          held_at?: string;
          released_at?: string | null;
        };
      };
      handover_verifications: {
        Row: {
          order_id: string;
          buyer_hash: string;
          seller_hash: string;
          buyer_verified_at: string | null;
          seller_verified_at: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          order_id: string;
          buyer_hash: string;
          seller_hash: string;
          buyer_verified_at?: string | null;
          seller_verified_at?: string | null;
          expires_at: string;
          created_at?: string;
        };
        Update: {
          order_id?: string;
          buyer_hash?: string;
          seller_hash?: string;
          buyer_verified_at?: string | null;
          seller_verified_at?: string | null;
          expires_at?: string;
          created_at?: string;
        };
      };
      ewaste_submissions: {
        Row: {
          id: string;
          user_id: string;
          category: string;
          weight_g: number;
          route: 'recycling_partner_demo' | 'component_harvesting' | 'community_collection';
          estimated_value: number;
          status: 'submitted' | 'scheduled_pickup' | 'received' | 'processed';
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category: string;
          weight_g: number;
          route: 'recycling_partner_demo' | 'component_harvesting' | 'community_collection';
          estimated_value?: number;
          status?: 'submitted' | 'scheduled_pickup' | 'received' | 'processed';
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category?: string;
          weight_g?: number;
          route?: 'recycling_partner_demo' | 'component_harvesting' | 'community_collection';
          estimated_value?: number;
          status?: 'submitted' | 'scheduled_pickup' | 'received' | 'processed';
          notes?: string | null;
          created_at?: string;
        };
      };
      impact_events: {
        Row: {
          id: string;
          user_id: string;
          source_type: string;
          source_id: string | null;
          reuse_g: number;
          recycle_g: number;
          savings_estimate: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          source_type: string;
          source_id?: string | null;
          reuse_g?: number;
          recycle_g?: number;
          savings_estimate?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          source_type?: string;
          source_id?: string | null;
          reuse_g?: number;
          recycle_g?: number;
          savings_estimate?: number;
          created_at?: string;
        };
      };
      ai_analyses: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string | null;
          type: string;
          model: string;
          result_json: Json;
          confidence: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          listing_id?: string | null;
          type: string;
          model: string;
          result_json: Json;
          confidence?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          listing_id?: string | null;
          type?: string;
          model?: string;
          result_json?: Json;
          confidence?: number | null;
          created_at?: string;
        };
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          entity_type: string;
          entity_id: string | null;
          action: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          entity_type: string;
          entity_id?: string | null;
          action: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          entity_type?: string;
          entity_id?: string | null;
          action?: string;
          metadata?: Json;
          created_at?: string;
        };
      };
    };
    Functions: {
      complete_order_atomic: {
        Args: {
          p_order_id: string;
          p_actor_id: string;
        };
        Returns: Json;
      };
    };
  };
}
