# ReCircuit Developer Guide

## Core Commands
- `npm run dev --workspace=apps/web` or `cd apps/web && npm run dev`: Start development server on port 3000
- `npm run build --workspace=apps/web`: Run Next.js production build and type checking
- `node --test apps/web/tests/unit/matching.test.mjs`: Run deterministic matching test suite

## Non-Negotiable Acceptance (P0 Path)
- Component listing stepper (Media → AI Scan → Confirm → Mode → Publish)
- Predefined project library (11 projects with normalized BOMs)
- Component-project matching engine: `Score = 100 * Σ min(available_i, required_i) / Σ required_i`
- Exact feasibility score and missing parts panel
- Waste reduction calculation (100% empirical mass in grams/kg)
- Dual-confirmation handover workflow with simulated escrow
- Zero-crash fallback data layer when live Supabase credentials are not provided
