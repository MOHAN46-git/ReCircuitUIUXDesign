'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Icon, ProjectVisual } from '@/components/ui/AppShell';
import { Listing } from '@/types';

function MarketplaceContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [listings, setListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedMode, setSelectedMode] = useState<'all' | 'sell' | 'rent' | 'donate'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedTerms, setExpandedTerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      setLoading(true);
      try {
        if (searchQuery.trim()) {
          const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          if (data.success) {
            setListings(data.listings);
            setExpandedTerms(data.expanded_terms || []);
          }
        } else {
          const res = await fetch('/api/listings');
          const data = await res.json();
          if (data.success) {
            setListings(data.listings);
            setExpandedTerms([]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(loadListings, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const filteredListings = listings.filter(l => {
    if (selectedMode !== 'all' && l.mode !== selectedMode) return false;
    if (selectedCategory !== 'all' && l.component?.category !== selectedCategory) return false;
    return true;
  });

  return (
    <section className="page-section">
      {/* Intro */}
      <div className="page-intro">
        <div>
          <span className="eyebrow">
            <Icon name="market" className="w-4 h-4" /> Circular marketplace
          </span>
          <h1>Source parts. Keep hardware in use.</h1>
          <p>
            Surplus microcontrollers, sensors, and components tested and shared by local makers.
          </p>
        </div>
        <Link href="/seller/listings/new" className="button button-primary">
          <Icon name="scan" />List a component
        </Link>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <label>
          <Icon name="search" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search marketplace"
            placeholder='Search components or try "RC drone"'
          />
        </label>
        <button
          onClick={() => setSelectedMode('all')}
          className={`filter ${selectedMode === 'all' ? 'active' : ''}`}
        >
          All items
        </button>
        <button
          onClick={() => setSelectedMode('sell')}
          className={`filter ${selectedMode === 'sell' ? 'active' : ''}`}
        >
          Buy used
        </button>
        <button
          onClick={() => setSelectedMode('rent')}
          className={`filter ${selectedMode === 'rent' ? 'active' : ''}`}
        >
          Rent
        </button>
        <button
          onClick={() => setSelectedMode('donate')}
          className={`filter ${selectedMode === 'donate' ? 'active' : ''}`}
        >
          Donations
        </button>
      </div>

      {/* AI Intent Expansion Chips */}
      {expandedTerms.length > 0 && searchQuery.trim() && (
        <div className="flex items-center gap-2 flex-wrap mb-6 text-xs text-[#667069]">
          <span className="flex items-center gap-1 font-bold text-[#176b4c]">
            <Icon name="spark" className="w-3.5 h-3.5" /> AI Intent concepts:
          </span>
          {expandedTerms.map((term, i) => (
            <button
              key={i}
              onClick={() => setSearchQuery(term)}
              className="px-2.5 py-1 rounded-full bg-[#e3f1e9] text-[#0d4f38] font-bold text-xs hover:bg-[#cde77c] transition-colors"
            >
              +{term}
            </button>
          ))}
        </div>
      )}

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="placeholder">
          <span className="banner-icon"><Icon name="box" /></span>
          <h3>No matching components found</h3>
          <p>Try searching for common terms like "Uno", "ESP32", "Pump", or "Motor".</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedMode('all');
            }}
            className="button button-secondary"
          >
            Reset search
          </button>
        </div>
      ) : (
        <div className="project-grid library-grid">
          {filteredListings.map(listing => {
            const isDonate = listing.mode === 'donate';
            const isRent = listing.mode === 'rent';

            return (
              <article className="project-card" key={listing.id}>
                <div className="h-44 relative bg-[#e3edf1] overflow-hidden">
                  <img
                    src={listing.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="difficulty font-bold">
                      {isDonate ? 'Free Donation' : (isRent ? 'For Rent' : 'Used Hardware')}
                    </span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-white/95 px-2 py-0.5 rounded text-[10px] font-bold text-[#176b4c]">
                    ~{listing.mass_g}g diverted
                  </div>
                </div>

                <div className="project-body">
                  <div className="card-topline">
                    <span className="text-xs font-bold text-[#667069] uppercase font-mono">
                      {listing.component?.category || 'Electronics'}
                    </span>
                    <strong className="text-base text-[#176b4c] font-mono">
                      {isDonate ? 'FREE' : (isRent ? `₹${listing.rent_per_day}/day` : `₹${listing.price}`)}
                    </strong>
                  </div>

                  <h3>{listing.title}</h3>
                  <p className="line-clamp-2">{listing.description}</p>

                  <div className="match-row">
                    <span>
                      <Icon name="box" className="w-4 h-4" />
                      Qty available: <strong>{listing.quantity}</strong>
                    </span>
                    <span className="text-xs text-[#667069]">
                      By {listing.seller?.first_name || 'Maker'}
                    </span>
                  </div>

                  <div className="project-foot">
                    <span>
                      <Icon name="check" className="w-4 h-4 text-[#176b4c]" />
                      Condition: {listing.condition.replace('_', ' ')}
                    </span>
                    <button onClick={() => router.push(`/marketplace/${listing.id}`)}>
                      View item <Icon name="arrow" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense fallback={
      <div className="placeholder">
        <span className="banner-icon"><Icon name="market" /></span>
        <p>Loading circular marketplace...</p>
      </div>
    }>
      <MarketplaceContent />
    </Suspense>
  );
}
