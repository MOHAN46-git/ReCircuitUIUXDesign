import React from 'react';
import Link from 'next/link';
import { Cpu, ShieldCheck, Heart, Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Purpose */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">ReCircuit</span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              AI-Powered Circular Electronics Reuse & Project-Matching Platform. Turning unused components, classroom surplus, and salvaged hardware into functional DIY maker projects.
            </p>
            <div className="flex items-center gap-4 text-xs text-emerald-400 pt-2">
              <span className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5" /> 100% Mass-Measured Diversion</span>
              <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Dual-OTP Demo Escrow</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/" className="hover:text-emerald-400 transition-colors">Dashboard</Link></li>
              <li><Link href="/projects" className="hover:text-emerald-400 transition-colors">Project Library & BOM</Link></li>
              <li><Link href="/marketplace" className="hover:text-emerald-400 transition-colors">Marketplace</Link></li>
              <li><Link href="/seller/listings/new" className="hover:text-emerald-400 transition-colors">Scan & List Component</Link></li>
              <li><Link href="/ewaste" className="hover:text-emerald-400 transition-colors">E-Waste Intake Flow</Link></li>
            </ul>
          </div>

          {/* Standards & Transparency */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3">Circular Standards</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>Deterministic Feasibility Algorithm</li>
              <li>Visible Condition Verification</li>
              <li>Dual Confirmation Handover</li>
              <li>Gram-Accurate Waste Auditing</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© 2026 ReCircuit. Circular Electronics Reuse Platform. Hackathon Edition.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Engineered with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for Maker Sustainability.
          </p>
        </div>
      </div>
    </footer>
  );
}
