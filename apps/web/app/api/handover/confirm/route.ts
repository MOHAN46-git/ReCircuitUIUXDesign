import { NextRequest, NextResponse } from 'next/server';
import { getDataStore } from '@/lib/domain/dataService';
import { HandoverConfirmSchema } from '@/lib/validation';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerSupabaseClient } from '@/lib/supabase/server';
import { SupabaseDataService } from '@/lib/supabase/supabaseService';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = HandoverConfirmSchema.parse(body);

    if (isSupabaseConfigured()) {
      const client = getServerSupabaseClient(req);
      if (client) {
        try {
          const { data: { user } } = await client.auth.getUser();
          const actorId = user?.id || getDataStore().getActiveUser().id;
          const supabaseService = new SupabaseDataService(client);

          const result = await supabaseService.confirmHandover({
            order_id: validated.order_id,
            code: validated.code,
            role: validated.role,
            actor_id: actorId,
          });

          return NextResponse.json({ ...result, source: 'supabase' });
        } catch (dbErr: any) {
          console.warn('Supabase handover confirmation error, falling back:', dbErr.message);
        }
      }
    }

    const store = getDataStore();
    const result = store.confirmHandover({
      order_id: validated.order_id,
      code: validated.code,
      role: validated.role,
    });

    return NextResponse.json({ ...result, source: 'local_store' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Verification failed' },
      { status: 400 }
    );
  }
}
