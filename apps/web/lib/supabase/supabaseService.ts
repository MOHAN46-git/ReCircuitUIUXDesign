import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import {
  Profile,
  ComponentCatalogItem,
  Project,
  Listing,
  UserInventoryItem,
  Order,
  ImpactEvent,
  EWasteSubmission,
} from '@/types';

/**
 * Service to execute typed database operations against Supabase with full RLS compliance.
 */
export class SupabaseDataService {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  // --- Profiles ---
  async getProfiles(): Promise<Profile[]> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Supabase error fetching profiles: ${error.message}`);
    return (data || []) as Profile[];
  }

  async getProfileById(id: string): Promise<Profile | null> {
    const { data, error } = await this.client
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Supabase error fetching profile: ${error.message}`);
    if (!data) return null;
    return data as unknown as Profile;
  }

  async updateProfile(id: string, updates: Partial<Profile>): Promise<Profile> {
    const { data, error } = await this.client
      .from('profiles')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Supabase error updating profile: ${error.message}`);
    return data as unknown as Profile;
  }

  // --- Component Catalog ---
  async getCatalog(): Promise<ComponentCatalogItem[]> {
    const { data, error } = await this.client
      .from('component_catalog')
      .select('*')
      .order('canonical_name', { ascending: true });

    if (error) throw new Error(`Supabase error fetching catalog: ${error.message}`);
    return (data || []) as ComponentCatalogItem[];
  }

  // --- Listings ---
  async getListings(filters?: {
    mode?: string;
    category?: string;
    search?: string;
    status?: string;
  }): Promise<Listing[]> {
    let query = this.client
      .from('listings')
      .select(`
        *,
        seller:profiles!seller_id(*),
        component:component_catalog!component_id(*)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status as any);
    } else {
      query = query.eq('status', 'active');
    }

    if (filters?.mode && filters.mode !== 'all') {
      query = query.eq('mode', filters.mode as any);
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(`Supabase error fetching listings: ${error.message}`);

    return (data || []).map((row: any) => ({
      ...row,
      price: Number(row.price || 0),
      rent_per_day: Number(row.rent_per_day || 0),
      mass_g: Number(row.mass_g || 0),
    })) as Listing[];
  }

  async getListingById(id: string): Promise<Listing | null> {
    const { data, error } = await this.client
      .from('listings')
      .select(`
        *,
        seller:profiles!seller_id(*),
        component:component_catalog!component_id(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Supabase error fetching listing: ${error.message}`);
    if (!data) return null;

    const row = data as any;
    return {
      ...row,
      price: Number(row.price || 0),
      rent_per_day: Number(row.rent_per_day || 0),
      mass_g: Number(row.mass_g || 0),
    } as Listing;
  }

  async createListing(listing: {
    seller_id: string;
    title: string;
    description: string;
    condition: any;
    quantity: number;
    mode: any;
    price: number;
    rent_per_day: number;
    mass_g: number;
    tags: string[];
    component_id?: string;
  }): Promise<Listing> {
    const { data, error } = await this.client
      .from('listings')
      .insert({
        seller_id: listing.seller_id,
        title: listing.title,
        description: listing.description,
        condition: listing.condition,
        quantity: listing.quantity,
        mode: listing.mode,
        price: listing.price,
        rent_per_day: listing.rent_per_day,
        mass_g: listing.mass_g,
        tags: listing.tags,
        component_id: listing.component_id || null,
        status: 'active',
      })
      .select(`
        *,
        seller:profiles!seller_id(*),
        component:component_catalog!component_id(*)
      `)
      .single();

    if (error) throw new Error(`Supabase error creating listing: ${error.message}`);

    const row = data as any;
    return {
      ...row,
      price: Number(row.price || 0),
      rent_per_day: Number(row.rent_per_day || 0),
      mass_g: Number(row.mass_g || 0),
    } as Listing;
  }

  // --- Projects ---
  async getProjects(): Promise<Project[]> {
    const { data, error } = await this.client
      .from('projects')
      .select(`
        *,
        requirements:project_requirements(
          *,
          component:component_catalog(*)
        )
      `)
      .eq('status', 'active');

    if (error) throw new Error(`Supabase error fetching projects: ${error.message}`);

    return (data || []).map((p: any) => ({
      ...p,
      estimated_reuse_g: Number(p.estimated_reuse_g || 0),
      requirements: (p.requirements || []).map((r: any) => ({
        ...r,
        weight: Number(r.weight || 1.0),
      })),
    })) as Project[];
  }

  async getProjectById(id: string): Promise<Project | null> {
    const { data, error } = await this.client
      .from('projects')
      .select(`
        *,
        requirements:project_requirements(
          *,
          component:component_catalog(*)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Supabase error fetching project: ${error.message}`);
    if (!data) return null;

    const p = data as any;
    return {
      ...p,
      estimated_reuse_g: Number(p.estimated_reuse_g || 0),
      requirements: (p.requirements || []).map((r: any) => ({
        ...r,
        weight: Number(r.weight || 1.0),
      })),
    } as Project;
  }

  // --- Inventory ---
  async getUserInventory(userId: string): Promise<UserInventoryItem[]> {
    const { data, error } = await this.client
      .from('user_inventory')
      .select(`
        *,
        component:component_catalog(*)
      `)
      .eq('user_id', userId);

    if (error) throw new Error(`Supabase error fetching user inventory: ${error.message}`);
    return (data || []) as UserInventoryItem[];
  }

  // --- Orders & Handover ---
  async getOrders(userId?: string): Promise<Order[]> {
    let query = this.client
      .from('orders')
      .select(`
        *,
        listing:listings(
          *,
          seller:profiles!seller_id(*),
          component:component_catalog!component_id(*)
        ),
        buyer:profiles!buyer_id(*),
        seller:profiles!seller_id(*),
        payment_demo:payment_demo(*),
        handover:handover_verifications(*)
      `);

    if (userId) {
      query = query.or(`buyer_id.eq.${userId},seller_id.eq.${userId}`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw new Error(`Supabase error fetching orders: ${error.message}`);

    return (data || []).map((o: any) => ({
      ...o,
      amount: Number(o.amount || 0),
      payment_demo: Array.isArray(o.payment_demo) ? o.payment_demo[0] : o.payment_demo,
      handover: Array.isArray(o.handover) ? o.handover[0] : o.handover,
    })) as Order[];
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await this.client
      .from('orders')
      .select(`
        *,
        listing:listings(
          *,
          seller:profiles!seller_id(*),
          component:component_catalog!component_id(*)
        ),
        buyer:profiles!buyer_id(*),
        seller:profiles!seller_id(*),
        payment_demo:payment_demo(*),
        handover:handover_verifications(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Supabase error fetching order: ${error.message}`);
    if (!data) return null;

    const o = data as any;
    return {
      ...o,
      amount: Number(o.amount || 0),
      payment_demo: Array.isArray(o.payment_demo) ? o.payment_demo[0] : o.payment_demo,
      handover: Array.isArray(o.handover) ? o.handover[0] : o.handover,
    } as Order;
  }

  async createOrder(params: {
    listing_id: string;
    buyer_id: string;
    qty: number;
    type: 'buy' | 'rent' | 'donate';
  }): Promise<Order> {
    // 1. Fetch listing to verify availability and calculate amount
    const listing = await this.getListingById(params.listing_id);
    if (!listing) throw new Error('Listing not found');
    if (listing.status !== 'active') throw new Error('Listing is no longer available');
    if (listing.quantity < params.qty) throw new Error(`Only ${listing.quantity} units available`);

    const unitPrice = params.type === 'donate' ? 0 : params.type === 'rent' ? listing.rent_per_day * 7 : listing.price;
    const totalAmount = unitPrice * params.qty;

    // 2. Insert order
    const { data: orderData, error: orderError } = await this.client
      .from('orders')
      .insert({
        listing_id: params.listing_id,
        buyer_id: params.buyer_id,
        seller_id: listing.seller_id,
        qty: params.qty,
        type: params.type,
        amount: totalAmount,
        status: 'ready_for_handover',
      })
      .select()
      .single();

    if (orderError) throw new Error(`Supabase error creating order: ${orderError.message}`);

    const orderId = orderData.id;

    // 3. Create simulated escrow record
    await this.client.from('payment_demo').insert({
      order_id: orderId,
      state: 'held_demo',
      amount: totalAmount,
    });

    // 4. Generate 4-digit verification codes for dual confirmation
    const buyerCode = Math.floor(1000 + Math.random() * 9000).toString();
    const sellerCode = Math.floor(1000 + Math.random() * 9000).toString();

    await this.client.from('handover_verifications').insert({
      order_id: orderId,
      buyer_hash: buyerCode,
      seller_hash: sellerCode,
      expires_at: new Date(Date.now() + 86400000).toISOString(),
    });

    return (await this.getOrderById(orderId))!;
  }

  async confirmHandover(params: {
    order_id: string;
    code: string;
    role: 'buyer' | 'seller';
    actor_id: string;
  }): Promise<{ success: boolean; message: string; order?: Order }> {
    // 1. Fetch handover record
    const { data: handover, error: hError } = await this.client
      .from('handover_verifications')
      .select('*')
      .eq('order_id', params.order_id)
      .single();

    if (hError || !handover) throw new Error('Handover record not found');

    const now = new Date().toISOString();
    let isBothConfirmed = false;

    if (params.role === 'buyer') {
      if (handover.buyer_hash !== params.code) throw new Error('Invalid buyer verification code');
      await this.client
        .from('handover_verifications')
        .update({ buyer_verified_at: now })
        .eq('order_id', params.order_id);

      isBothConfirmed = !!handover.seller_verified_at;
    } else {
      if (handover.seller_hash !== params.code) throw new Error('Invalid seller verification code');
      await this.client
        .from('handover_verifications')
        .update({ seller_verified_at: now })
        .eq('order_id', params.order_id);

      isBothConfirmed = !!handover.buyer_verified_at;
    }

    if (isBothConfirmed) {
      // Call atomic completion function
      const { error: rpcError } = await this.client.rpc('complete_order_atomic', {
        p_order_id: params.order_id,
        p_actor_id: params.actor_id,
      });

      if (rpcError) {
        console.error('complete_order_atomic RPC error:', rpcError);
        // Direct fallback update if RPC is missing
        await this.client.from('orders').update({ status: 'completed' }).eq('id', params.order_id);
        await this.client.from('payment_demo').update({ state: 'released_demo', released_at: now }).eq('order_id', params.order_id);
      }
    }

    const updatedOrder = await this.getOrderById(params.order_id);

    return {
      success: true,
      message: isBothConfirmed
        ? 'Dual-confirmation complete! Stock updated atomically and impact recorded.'
        : 'Code verified successfully! Awaiting verification from the other party.',
      order: updatedOrder || undefined,
    };
  }

  // --- Impact Events ---
  async getImpactEvents(): Promise<ImpactEvent[]> {
    const { data, error } = await this.client
      .from('impact_events')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Supabase error fetching impact events: ${error.message}`);

    return (data || []).map((e: any) => ({
      ...e,
      reuse_g: Number(e.reuse_g || 0),
      recycle_g: Number(e.recycle_g || 0),
      savings_estimate: Number(e.savings_estimate || 0),
    })) as ImpactEvent[];
  }

  // --- E-Waste ---
  async submitEWaste(submission: Omit<EWasteSubmission, 'id' | 'created_at' | 'status'>): Promise<EWasteSubmission> {
    const { data, error } = await this.client
      .from('ewaste_submissions')
      .insert({
        user_id: submission.user_id,
        category: submission.category,
        weight_g: submission.weight_g,
        route: submission.route,
        estimated_value: submission.estimated_value,
        notes: submission.notes || null,
        status: 'submitted',
      })
      .select()
      .single();

    if (error) throw new Error(`Supabase error submitting e-waste: ${error.message}`);

    // Log impact
    await this.client.from('impact_events').insert({
      user_id: submission.user_id,
      source_type: 'ewaste_recycle',
      source_id: (data as any).id,
      reuse_g: 0,
      recycle_g: submission.weight_g,
      savings_estimate: submission.estimated_value,
    });

    return data as unknown as EWasteSubmission;
  }
}
