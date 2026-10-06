import React from 'react';
import Link from 'next/link';
import { Listing } from '@/types';
import { Tag, Sparkles, Scale, ShieldCheck, HeartHandshake, Calendar } from 'lucide-react';

interface ListingCardProps {
  listing: Listing;
  onQuickOrder?: (listing: Listing) => void;
}

export default function ListingCard({ listing, onQuickOrder }: ListingCardProps) {
  const isDonate = listing.mode === 'donate';
  const isRent = listing.mode === 'rent';
  const isSell = listing.mode === 'sell';

  const conditionLabels: Record<string, { label: string; color: string }> = {
    new: { label: 'New / Unopened', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    like_new: { label: 'Like New', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
    used_functional: { label: 'Tested / Functional', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    untested: { label: 'Untested Salvage', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    for_parts: { label: 'For Parts / E-Waste', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  };

  const cond = conditionLabels[listing.condition] || { label: listing.condition, color: 'bg-slate-800 text-slate-300' };

  return (
    <div className="group rounded-2xl bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 shadow-lg hover:shadow-emerald-500/5 flex flex-col justify-between overflow-hidden">
      {/* Media & Badges */}
      <div>
        <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden">
          <img
            src={listing.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          {/* Mode Badge (Sell, Rent, Donate) */}
          <div className="absolute top-3 left-3 flex gap-2">
            {isDonate && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-500/90 text-white shadow">
                <HeartHandshake className="w-3.5 h-3.5" /> FREE DONATION
              </span>
            )}
            {isRent && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/90 text-slate-950 shadow">
                <Calendar className="w-3.5 h-3.5" /> RENT PER DAY
              </span>
            )}
            {isSell && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 shadow">
                BUY USED
              </span>
            )}
          </div>

          {/* Mass Badge */}
          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur border border-slate-700/60 text-[11px] font-mono text-slate-300 flex items-center gap-1">
            <Scale className="w-3 h-3 text-emerald-400" />
            {listing.mass_g}g diverted
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 space-y-3">
          {/* Condition Chip */}
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-mono px-2 py-0.5 rounded-md border ${cond.color}`}>
              {cond.label}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Qty: <strong className="text-white">{listing.quantity}</strong> available
            </span>
          </div>

          {/* Title & Description */}
          <div>
            <h3 className="font-semibold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
              {listing.title}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {listing.description}
            </p>
          </div>

          {/* Tags / Project compatibility chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {listing.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700/60 font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer & Actions */}
      <div className="p-4 pt-2 border-t border-slate-800/80 bg-slate-950/40 flex items-center justify-between">
        {/* Price display */}
        <div>
          {isDonate ? (
            <span className="text-base font-bold text-purple-400 font-mono">₹0 (Free)</span>
          ) : isRent ? (
            <div>
              <span className="text-base font-bold text-amber-400 font-mono">₹{listing.rent_per_day}</span>
              <span className="text-[11px] text-slate-400 font-mono">/day</span>
            </div>
          ) : (
            <span className="text-lg font-bold text-emerald-400 font-mono">₹{listing.price}</span>
          )}
          <p className="text-[10px] text-slate-500">
            By {listing.seller?.first_name || 'Maker'} ({listing.seller?.organization || 'Makerspace'})
          </p>
        </div>

        {/* Action Link / Button */}
        <Link
          href={`/marketplace/${listing.id}`}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 border border-slate-700 hover:border-emerald-500 transition-colors shadow-sm"
        >
          {isDonate ? 'Claim Part' : (isRent ? 'Rent' : 'Buy Now')}
        </Link>
      </div>
    </div>
  );
}
