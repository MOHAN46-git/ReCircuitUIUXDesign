import { NextRequest, NextResponse } from 'next/server';
import { getDataStore } from '@/lib/domain/dataService';
import { CreateOrderSchema } from '@/lib/validation';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerSupabaseClient } from '@/lib/supabase/server';
import { SupabaseDataService } from '@/lib/supabase/supabaseService';

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const client = getServerSupabaseClient(req);
      if (client) {
        try {
          const { data: { user } } = await client.auth.getUser();
          const supabaseService = new SupabaseDataService(client);
          const orders = await supabaseService.getOrders(user?.id);
          return NextResponse.json({ success: true, orders, source: 'supabase' });
        } catch (dbErr: any) {
          console.warn('Supabase orders fetch error, falling back:', dbErr.message);
        }
      }
    }

    const store = getDataStore();
    const orders = store.getOrders();
    return NextResponse.json({ success: true, orders, source: 'local_store' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateOrderSchema.parse(body);

    if (isSupabaseConfigured()) {
      const client = getServerSupabaseClient(req);
      if (client) {
        try {
          const { data: { user } } = await client.auth.getUser();
          const buyerId = user?.id || getDataStore().getActiveUser().id;
          const supabaseService = new SupabaseDataService(client);

          const order = await supabaseService.createOrder({
            listing_id: validated.listing_id,
            buyer_id: buyerId,
            qty: validated.qty,
            type: validated.type,
          });

          return NextResponse.json({
            success: true,
            order,
            source: 'supabase',
            message: 'Order created with demo payment hold! Ready for handover verification.',
          }, { status: 201 });
        } catch (dbErr: any) {
          console.warn('Supabase order creation error, falling back:', dbErr.message);
        }
      }
    }

    const store = getDataStore();
    const activeUser = store.getActiveUser();

    const order = store.createOrder({
      listing_id: validated.listing_id,
      buyer_id: activeUser.id,
      qty: validated.qty,
      type: validated.type,
    });

    return NextResponse.json({
      success: true,
      order,
      source: 'local_store',
      message: 'Order created with demo payment hold! Ready for handover verification.',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to place order' },
      { status: 400 }
    );
  }
}
