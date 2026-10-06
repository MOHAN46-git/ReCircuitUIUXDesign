import { NextRequest, NextResponse } from 'next/server';
import { getDataStore } from '@/lib/domain/dataService';
import { CreateEWasteSchema } from '@/lib/validation';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerSupabaseClient } from '@/lib/supabase/server';
import { SupabaseDataService } from '@/lib/supabase/supabaseService';

export async function GET(req: NextRequest) {
  try {
    if (isSupabaseConfigured()) {
      const client = getServerSupabaseClient(req);
      if (client) {
        try {
          const supabaseService = new SupabaseDataService(client);
          const impact = await supabaseService.getImpactEvents();
          return NextResponse.json({ success: true, impact, source: 'supabase' });
        } catch (dbErr: any) {
          console.warn('Supabase ewaste/impact fetch error, falling back:', dbErr.message);
        }
      }
    }

    const store = getDataStore();
    const ewaste = store.getEWasteSubmissions();
    return NextResponse.json({ success: true, ewaste, source: 'local_store' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreateEWasteSchema.parse(body);

    const estimatedValue = Math.round((validated.weight_g / 1000) * 140);

    if (isSupabaseConfigured()) {
      const client = getServerSupabaseClient(req);
      if (client) {
        try {
          const { data: { user } } = await client.auth.getUser();
          const userId = user?.id || getDataStore().getActiveUser().id;
          const supabaseService = new SupabaseDataService(client);

          const submission = await supabaseService.submitEWaste({
            user_id: userId,
            category: validated.category,
            weight_g: validated.weight_g,
            route: validated.route,
            estimated_value: estimatedValue,
            notes: validated.notes,
          });

          return NextResponse.json({
            success: true,
            submission,
            source: 'supabase',
            message: `E-waste submission registered! ~${(validated.weight_g / 1000).toFixed(2)}kg diverted from improper landfill dumping.`,
          }, { status: 201 });
        } catch (dbErr: any) {
          console.warn('Supabase ewaste submit error, falling back:', dbErr.message);
        }
      }
    }

    const store = getDataStore();
    const activeUser = store.getActiveUser();

    const submission = store.submitEWaste({
      user_id: activeUser.id,
      category: validated.category,
      weight_g: validated.weight_g,
      route: validated.route,
      estimated_value: estimatedValue,
      notes: validated.notes,
    });

    return NextResponse.json({
      success: true,
      submission,
      source: 'local_store',
      message: `E-waste submission registered! ~${(validated.weight_g / 1000).toFixed(2)}kg diverted from improper landfill dumping.`,
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit e-waste' },
      { status: 400 }
    );
  }
}
