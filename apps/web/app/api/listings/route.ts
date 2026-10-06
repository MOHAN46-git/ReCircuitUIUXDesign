import { NextRequest, NextResponse } from 'next/server';
import { getDataStore } from '@/lib/domain/dataService';
import { CreateListingSchema } from '@/lib/validation';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerSupabaseClient } from '@/lib/supabase/server';
import { SupabaseDataService } from '@/lib/supabase/supabaseService';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const mode = searchParams.get('mode') || undefined;
    const category = searchParams.get('category') || undefined;
    const q = searchParams.get('q')?.toLowerCase();

    // Check if live Supabase is configured
    if (isSupabaseConfigured()) {
      const client = getServerSupabaseClient(req);
      if (client) {
        try {
          const supabaseService = new SupabaseDataService(client);
          const listings = await supabaseService.getListings({
            mode: mode !== 'all' ? mode : undefined,
            category,
            search: q,
          });
          return NextResponse.json({ success: true, listings, source: 'supabase' });
        } catch (dbErr: any) {
          console.warn('Supabase query failed, falling back to local memory store:', dbErr.message);
        }
      }
    }

    // Default zero-config in-memory fallback
    const store = getDataStore();
    let listings = store.getListings();

    if (mode && mode !== 'all') {
      listings = listings.filter(l => l.mode === mode);
    }

    if (category) {
      listings = listings.filter(l => l.component?.category === category);
    }

    if (q) {
      listings = listings.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.tags.some(t => t.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      listings,
      source: 'local_store',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateListingSchema.parse(body);

    // If live Supabase is configured
    if (isSupabaseConfigured()) {
      const client = getServerSupabaseClient(req);
      if (client) {
        try {
          const supabaseService = new SupabaseDataService(client);
          // Try to get user from token or fallback to passed seller_id or active user
          const { data: { user } } = await client.auth.getUser();
          const sellerId = user?.id || (body as any).seller_id || getDataStore().getActiveUser().id;

          const newListing = await supabaseService.createListing({
            seller_id: sellerId,
            title: validated.title,
            description: validated.description,
            condition: validated.condition,
            quantity: validated.quantity,
            mode: validated.mode,
            price: validated.price,
            rent_per_day: validated.rent_per_day,
            mass_g: validated.mass_g,
            tags: validated.tags,
            component_id: validated.component_id,
          });

          return NextResponse.json({
            success: true,
            listing: newListing,
            source: 'supabase',
          }, { status: 201 });
        } catch (dbErr: any) {
          console.warn('Supabase listing insert failed, falling back to local memory store:', dbErr.message);
        }
      }
    }

    // Fallback store
    const store = getDataStore();
    const activeUser = store.getActiveUser();

    let compId = validated.component_id;
    if (!compId) {
      const catalog = store.getCatalog();
      const match = catalog.find(c => c.canonical_name.toLowerCase() === validated.title.toLowerCase());
      if (match) {
        compId = match.id;
      }
    }

    const newListing = store.createListing({
      seller_id: activeUser.id,
      component_id: compId,
      title: validated.title,
      description: validated.description,
      condition: validated.condition,
      quantity: validated.quantity,
      mode: validated.mode,
      price: validated.price,
      rent_per_day: validated.rent_per_day,
      mass_g: validated.mass_g,
      tags: validated.tags,
      image_url: validated.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80',
    });

    return NextResponse.json({
      success: true,
      listing: newListing,
      source: 'local_store',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create listing' },
      { status: 400 }
    );
  }
}
