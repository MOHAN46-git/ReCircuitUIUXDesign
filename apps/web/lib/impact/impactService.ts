import { ImpactEvent } from '@/types';

export interface ImpactSummary {
  total_reuse_g: number;
  total_recycle_g: number;
  total_mass_diverted_g: number;
  total_reuse_kg: number;
  total_recycle_kg: number;
  total_mass_diverted_kg: number;
  total_savings_inr: number;
  completed_orders_count: number;
  projects_enabled_count: number;
  estimated_co2_kg: number; // Transparently labeled approximate model
}

/**
 * Calculates aggregated sustainability metrics
 */
export function calculateImpactSummary(
  events: ImpactEvent[],
  projectsEnabledCount: number = 0
): ImpactSummary {
  let totalReuseG = 0;
  let totalRecycleG = 0;
  let totalSavings = 0;
  let completedOrders = 0;

  for (const event of events) {
    totalReuseG += Number(event.reuse_g) || 0;
    totalRecycleG += Number(event.recycle_g) || 0;
    totalSavings += Number(event.savings_estimate) || 0;
    if (event.source_type === 'order_completion') {
      completedOrders++;
    }
  }

  const totalDivertedG = totalReuseG + totalRecycleG;
  const totalDivertedKg = Number((totalDivertedG / 1000).toFixed(2));
  const totalReuseKg = Number((totalReuseG / 1000).toFixed(2));
  const totalRecycleKg = Number((totalRecycleG / 1000).toFixed(2));

  // Circular electronics factor: approx ~1.8kg CO2 equivalent avoided per 1kg electronics hardware reused
  const estimatedCo2 = Number((totalReuseKg * 1.8).toFixed(2));

  return {
    total_reuse_g: Math.round(totalReuseG),
    total_recycle_g: Math.round(totalRecycleG),
    total_mass_diverted_g: Math.round(totalDivertedG),
    total_reuse_kg: totalReuseKg,
    total_recycle_kg: totalRecycleKg,
    total_mass_diverted_kg: totalDivertedKg,
    total_savings_inr: Math.round(totalSavings),
    completed_orders_count: completedOrders,
    projects_enabled_count: projectsEnabledCount,
    estimated_co2_kg: estimatedCo2,
  };
}

/**
 * Formats mass into readable string (e.g., '350 g' or '1.45 kg')
 */
export function formatMass(grams: number): string {
  if (grams >= 1000) {
    return `${(grams / 1000).toFixed(2)} kg`;
  }
  return `${Math.round(grams)} g`;
}
