import React from 'react';
import Link from 'next/link';
import { BOMItemMatch } from '@/types';
import { CheckCircle2, AlertTriangle, XCircle, Search, ExternalLink } from 'lucide-react';

interface BOMTableProps {
  boms: BOMItemMatch[];
  onFindMissing?: (componentName: string) => void;
}

export default function BOMTable({ boms }: BOMTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-xl">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-950/80 text-xs uppercase font-mono text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3 px-4">Component & Category</th>
            <th className="py-3 px-3 text-center">Required</th>
            <th className="py-3 px-3 text-center">In Inventory</th>
            <th className="py-3 px-4 text-center">Status</th>
            <th className="py-3 px-3 text-right">Mass (~g)</th>
            <th className="py-3 px-4 text-right">Marketplace Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/80">
          {boms.map((item, index) => {
            const isHave = item.status === 'HAVE';
            const isPartial = item.status === 'PARTIAL';
            const isMissing = item.status === 'MISSING';

            return (
              <tr key={item.component_id || index} className="hover:bg-slate-800/30 transition-colors">
                {/* Component Name & Criticality */}
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="font-semibold text-white text-sm flex items-center gap-1.5">
                        {item.canonical_name}
                        {item.critical && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 font-mono">
                            Critical
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">{item.category}</p>
                    </div>
                  </div>
                </td>

                {/* Required Qty */}
                <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-200">
                  {item.required_qty}
                </td>

                {/* Available Qty */}
                <td className="py-3.5 px-3 text-center font-mono font-semibold">
                  <span className={isHave ? 'text-emerald-400' : (isPartial ? 'text-amber-400' : 'text-slate-500')}>
                    {item.available_qty}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-4 text-center">
                  {isHave && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      In Inventory
                    </span>
                  )}
                  {isPartial && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 border border-amber-500/30">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Need {item.missing_qty} more
                    </span>
                  )}
                  {isMissing && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      <XCircle className="w-3.5 h-3.5" />
                      Missing ({item.required_qty})
                    </span>
                  )}
                </td>

                {/* Default Mass */}
                <td className="py-3.5 px-3 text-right font-mono text-xs text-slate-400">
                  ~{item.default_mass_g * item.required_qty} g
                </td>

                {/* Source in Marketplace Action */}
                <td className="py-3.5 px-4 text-right">
                  {isHave ? (
                    <span className="text-xs text-emerald-400/80 font-mono">Ready to wire</span>
                  ) : (
                    <Link
                      href={`/marketplace?q=${encodeURIComponent(item.canonical_name)}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <Search className="w-3 h-3 text-emerald-400" />
                      Find in Market
                      <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
