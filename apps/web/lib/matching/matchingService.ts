import {
  ComponentCatalogItem,
  Project,
  ProjectRequirement,
  UserInventoryItem,
  ProjectFeasibility,
  BOMItemMatch,
  Listing
} from '@/types';

/**
 * Normalizes input name or alias to canonical component item
 */
export function normalizeComponentAlias(
  query: string,
  catalog: ComponentCatalogItem[]
): ComponentCatalogItem | null {
  const clean = query.trim().toLowerCase();
  for (const item of catalog) {
    if (item.canonical_name.toLowerCase() === clean) {
      return item;
    }
    for (const alias of item.aliases) {
      if (clean.includes(alias.toLowerCase()) || alias.toLowerCase() === clean) {
        return item;
      }
    }
  }
  return null;
}

/**
 * Deterministic Project Feasibility Engine
 * Formula: Score = 100 * SUM(min(available_i, required_i)) / SUM(required_i)
 * Weighted Score = 100 * SUM(weight_i * min(available_i, required_i) / required_i) / SUM(weight_i)
 */
export function calculateProjectFeasibility(
  project: Project,
  userInventory: UserInventoryItem[],
  catalog: ComponentCatalogItem[],
  activeListings?: Listing[]
): ProjectFeasibility {
  const requirements = project.requirements || [];

  if (requirements.length === 0) {
    return {
      project_id: project.id,
      project,
      score: 0,
      weighted_score: 0,
      matched_items_count: 0,
      total_items_count: 0,
      is_buildable: false,
      reusable_mass_g: 0,
      boms: [],
      missing_items: [],
    };
  }

  // Create an inventory lookup map: component_id -> total available qty
  const inventoryMap = new Map<string, number>();
  for (const item of userInventory) {
    const current = inventoryMap.get(item.component_id) || 0;
    inventoryMap.set(item.component_id, current + item.qty);
  }

  let sumMatchedQty = 0;
  let sumRequiredQty = 0;
  let sumWeightedMatch = 0;
  let sumWeightTotal = 0;
  let matchedItemsCount = 0;
  let totalReusableGrams = 0;

  const boms: BOMItemMatch[] = [];
  const missingItems: BOMItemMatch[] = [];

  for (const req of requirements) {
    const component = req.component || catalog.find(c => c.id === req.component_id);
    const canonicalName = component?.canonical_name || 'Generic Component';
    const category = component?.category || 'Components';
    const defaultMassG = component?.default_mass_g || 50;

    const available = inventoryMap.get(req.component_id) || 0;
    const required = req.required_qty;
    const matched = Math.min(available, required);
    const missing = Math.max(0, required - available);

    sumMatchedQty += matched;
    sumRequiredQty += required;

    const weight = req.weight || 1.0;
    sumWeightedMatch += (matched / required) * weight;
    sumWeightTotal += weight;

    let status: 'HAVE' | 'PARTIAL' | 'MISSING' = 'MISSING';
    if (available >= required) {
      status = 'HAVE';
      matchedItemsCount++;
    } else if (available > 0) {
      status = 'PARTIAL';
    }

    // Accumulate reusable mass for parts user already has towards this project
    totalReusableGrams += matched * defaultMassG;

    // Find any matching marketplace listings to help user source missing parts
    const relevantListings = activeListings
      ? activeListings.filter(l => l.component_id === req.component_id && l.status === 'active')
      : [];

    const bomItem: BOMItemMatch = {
      component_id: req.component_id,
      canonical_name: canonicalName,
      category,
      required_qty: required,
      available_qty: available,
      missing_qty: missing,
      status,
      critical: req.critical,
      weight,
      default_mass_g: defaultMassG,
      marketplace_listings: relevantListings,
    };

    boms.push(bomItem);

    if (missing > 0) {
      missingItems.push(bomItem);
    }
  }

  // Exact basic score formula: 100 * Σ min(available_i, required_i) / Σ required_i
  const rawScore = sumRequiredQty > 0 ? (sumMatchedQty / sumRequiredQty) * 100 : 0;
  const score = Math.round(rawScore);

  const rawWeightedScore = sumWeightTotal > 0 ? (sumWeightedMatch / sumWeightTotal) * 100 : 0;
  const weightedScore = Math.round(rawWeightedScore);

  // A project is buildable if no critical component is missing and score is 100%
  const hasCriticalMissing = boms.some(b => b.critical && b.missing_qty > 0);
  const isBuildable = score === 100 && !hasCriticalMissing;

  return {
    project_id: project.id,
    project,
    score,
    weighted_score: weightedScore,
    matched_items_count: matchedItemsCount,
    total_items_count: requirements.length,
    is_buildable: isBuildable,
    reusable_mass_g: Math.round(totalReusableGrams),
    boms,
    missing_items: missingItems,
  };
}

/**
 * Rank multiple projects based on deterministic feasibility
 */
export function rankProjectsByFeasibility(
  projects: Project[],
  userInventory: UserInventoryItem[],
  catalog: ComponentCatalogItem[],
  activeListings?: Listing[]
): ProjectFeasibility[] {
  const results = projects.map(proj =>
    calculateProjectFeasibility(proj, userInventory, catalog, activeListings)
  );

  // Sort descending by score, then by number of matched items, then by estimated reuse mass
  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.matched_items_count !== a.matched_items_count) return b.matched_items_count - a.matched_items_count;
    return b.reusable_mass_g - a.reusable_mass_g;
  });
}
