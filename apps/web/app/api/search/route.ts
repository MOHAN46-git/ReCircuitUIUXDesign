import { NextRequest, NextResponse } from 'next/server';
import { getDataStore } from '@/lib/domain/dataService';
import { getAIProvider } from '@/lib/ai/provider';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { getServerSupabaseClient } from '@/lib/supabase/server';
import { SupabaseDataService } from '@/lib/supabase/supabaseService';
import { Listing, Project } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q')?.trim() || '';

    const store = getDataStore();
    const provider = getAIProvider();

    // 1. Expand intent using AI provider (e.g. 'drone' -> ['motor', 'esc', 'battery'])
    const expandedTerms = await provider.expandSearchIntent(q);

    let allListings: Listing[] = [];
    let allProjects: Project[] = [];

    if (isSupabaseConfigured()) {
      const client = getServerSupabaseClient(req);
      if (client) {
        try {
          const supabaseService = new SupabaseDataService(client);
          const [dbListings, dbProjects] = await Promise.all([
            supabaseService.getListings({ status: 'active' }),
            supabaseService.getProjects(),
          ]);
          if (dbListings.length > 0 || dbProjects.length > 0) {
            allListings = dbListings;
            allProjects = dbProjects;
          }
        } catch (dbErr: any) {
          console.warn('Supabase search fetch error, falling back to local store:', dbErr.message);
        }
      }
    }

    if (allListings.length === 0) {
      allListings = store.getListings();
      allProjects = store.getProjects();
    }

    const queryLower = q.toLowerCase();
    const terms = Array.from(new Set([queryLower, ...expandedTerms.map(t => t.toLowerCase())]));

    // Match listings
    const matchedListings = allListings.filter(listing => {
      const title = listing.title.toLowerCase();
      const desc = listing.description.toLowerCase();
      const tags = (listing.tags || []).map(t => t.toLowerCase());

      return terms.some(term =>
        title.includes(term) ||
        desc.includes(term) ||
        tags.some(t => t.includes(term))
      );
    });

    // Match projects
    const matchedProjects = allProjects.filter(project => {
      const title = project.title.toLowerCase();
      const desc = project.description.toLowerCase();
      const category = project.category.toLowerCase();

      return terms.some(term =>
        title.includes(term) ||
        desc.includes(term) ||
        category.includes(term)
      );
    });

    return NextResponse.json({
      success: true,
      query: q,
      expanded_terms: expandedTerms,
      listings: matchedListings,
      projects: matchedProjects,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
