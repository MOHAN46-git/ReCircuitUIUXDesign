import { NextRequest, NextResponse } from 'next/server';
import { getDataStore } from '@/lib/domain/dataService';
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
          const allProfiles = await supabaseService.getProfiles();

          if (user) {
            const active = await supabaseService.getProfileById(user.id);
            if (active) {
              return NextResponse.json({
                success: true,
                activeUser: active,
                availableUsers: allProfiles,
                source: 'supabase',
              });
            }
          }

          if (allProfiles.length > 0) {
            return NextResponse.json({
              success: true,
              activeUser: allProfiles[0],
              availableUsers: allProfiles,
              source: 'supabase',
            });
          }
        } catch (dbErr: any) {
          console.warn('Supabase profiles fetch error, falling back:', dbErr.message);
        }
      }
    }

    const store = getDataStore();
    return NextResponse.json({
      success: true,
      activeUser: store.getActiveUser(),
      availableUsers: store.getProfiles(),
      source: 'local_store',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, updates } = body;

    if (isSupabaseConfigured() && updates && userId) {
      const client = getServerSupabaseClient(req);
      if (client) {
        try {
          const supabaseService = new SupabaseDataService(client);
          const updated = await supabaseService.updateProfile(userId, updates);
          return NextResponse.json({ success: true, activeUser: updated, source: 'supabase' });
        } catch (dbErr: any) {
          console.warn('Supabase profile update error, falling back:', dbErr.message);
        }
      }
    }

    const store = getDataStore();
    if (userId) {
      store.setActiveUser(userId);
    }

    return NextResponse.json({
      success: true,
      activeUser: store.getActiveUser(),
      source: 'local_store',
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
