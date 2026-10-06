import { NextRequest, NextResponse } from 'next/server';
import { getDataStore } from '@/lib/domain/dataService';
import { calculateProjectFeasibility } from '@/lib/matching/matchingService';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerSupabaseClient } from '@/lib/supabase/server';
import { SupabaseDataService } from '@/lib/supabase/supabaseService';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (isSupabaseConfigured()) {
      const client = getServerSupabaseClient(req);
      if (client) {
        try {
          const supabaseService = new SupabaseDataService(client);
          const { data: { user } } = await client.auth.getUser();
          const userId = user?.id || getDataStore().getActiveUser().id;

          const [project, catalog, listings, inventory] = await Promise.all([
            supabaseService.getProjectById(params.id),
            supabaseService.getCatalog(),
            supabaseService.getListings({ status: 'active' }),
            supabaseService.getUserInventory(userId),
          ]);

          if (project) {
            const feasibility = calculateProjectFeasibility(
              project,
              inventory,
              catalog,
              listings
            );

            return NextResponse.json({
              success: true,
              feasibility,
              source: 'supabase',
            });
          }
        } catch (dbErr: any) {
          console.warn('Supabase match calculation error, falling back:', dbErr.message);
        }
      }
    }

    const store = getDataStore();
    const project = store.getProjectById(params.id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const inventory = store.getUserInventory();
    const catalog = store.getCatalog();
    const listings = store.getListings();

    const feasibility = calculateProjectFeasibility(
      project,
      inventory,
      catalog,
      listings
    );

    return NextResponse.json({
      success: true,
      feasibility,
      source: 'local_store',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
