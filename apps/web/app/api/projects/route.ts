import { NextRequest, NextResponse } from 'next/server';
import { getDataStore } from '@/lib/domain/dataService';
import { rankProjectsByFeasibility } from '@/lib/matching/matchingService';
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
          const { data: { user } } = await client.auth.getUser();
          const userId = user?.id || getDataStore().getActiveUser().id;

          const [projects, catalog, listings, inventory] = await Promise.all([
            supabaseService.getProjects(),
            supabaseService.getCatalog(),
            supabaseService.getListings({ status: 'active' }),
            supabaseService.getUserInventory(userId),
          ]);

          if (projects && projects.length > 0) {
            const rankedFeasibilities = rankProjectsByFeasibility(
              projects,
              inventory,
              catalog,
              listings
            );

            return NextResponse.json({
              success: true,
              projects: rankedFeasibilities,
              source: 'supabase',
            });
          }
        } catch (dbErr: any) {
          console.warn('Supabase projects fetch error, falling back:', dbErr.message);
        }
      }
    }

    const store = getDataStore();
    const projects = store.getProjects();
    const inventory = store.getUserInventory();
    const catalog = store.getCatalog();
    const listings = store.getListings();

    const rankedFeasibilities = rankProjectsByFeasibility(
      projects,
      inventory,
      catalog,
      listings
    );

    return NextResponse.json({
      success: true,
      projects: rankedFeasibilities,
      source: 'local_store',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
