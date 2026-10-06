'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/AppShell';
import { Listing } from '@/types';

export default function ListingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listingId = params.listingId as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderQty, setOrderQty] = useState(1);
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<any>(null);

  useEffect(() => {
    if (!listingId) return;

    fetch('/api/listings')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.listings.find((l: Listing) => l.id === listingId);
          if (found) {
            setListing(found);
          } else {
            setError('Listing not found');
          }
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [listingId]);

  const handlePlaceOrder = async () => {
    if (!listing) return;
    setIsOrdering(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: listing.id,
          qty: orderQty,
          type: listing.mode,
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to place order');

      setOrderSuccess(data.order);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsOrdering(false);
    }
  };

  if (loading) {
    return (
      <div className="placeholder">
        <span className="banner-icon"><Icon name="box" /></span>
        <p>Loading component details...</p>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="placeholder">
        <span className="banner-icon"><Icon name="info" /></span>
        <h1>Listing Not Found</h1>
        <p>{error || 'Could not find this component.'}</p>
        <Link href="/marketplace" className="button button-secondary">
          Return to marketplace
        </Link>
      </div>
    );
  }

  const isDonate = listing.mode === 'donate';
  const isRent = listing.mode === 'rent';
  const totalPrice = isDonate ? 0 : (isRent ? listing.rent_per_day * orderQty : listing.price * orderQty);

  return (
    <section className="detail-page">
      <button className="back-link" onClick={() => router.push('/marketplace')}>
        ← Back to marketplace
      </button>

      <div className="detail-grid">
        {/* Left Column: Image, Condition & Inspection notes */}
        <div>
          <div className="h-80 rounded-2xl bg-white border border-[#dfe3dc] overflow-hidden relative shadow-sm">
            <img
              src={listing.image_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'}
              alt={listing.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <span className="difficulty">
                {isDonate ? 'Free Donation' : (isRent ? 'For Rent' : 'Used Hardware')}
              </span>
            </div>
            <div className="absolute bottom-3 right-3 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-[#176b4c] shadow-sm">
              ~{listing.mass_g * orderQty}g kept in circulation
            </div>
          </div>

          <div className="detail-title">
            <span className="difficulty">{listing.component?.category || 'Hardware'}</span>
            <h1>{listing.title}</h1>
            <p className="mt-1">
              Listed by <strong>{listing.seller?.first_name} {listing.seller?.last_name}</strong> ({listing.seller?.organization})
            </p>
          </div>

          <div className="why-match">
            <span className="stat-icon mint">
              <Icon name="check" className="w-5 h-5 text-[#176b4c]" />
            </span>
            <div>
              <h2>Hardware inspection notes</h2>
              <p className="text-xs text-[#667069] mt-1 leading-relaxed">
                {listing.description}
              </p>
              <div className="flex gap-2 flex-wrap mt-3">
                {listing.tags.map((t, idx) => (
                  <span key={idx} className="bg-[#f0f2ed] text-[#475569] px-2 py-0.5 rounded text-[11px] font-mono">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Checkout Box */}
        <div className="bom-panel">
          <div className="bom-header">
            <div>
              <span className="overline">Acquire component</span>
              <h2>
                {isDonate ? 'FREE' : (isRent ? `₹${listing.rent_per_day} / day` : `₹${listing.price}`)}
              </h2>
            </div>
            <span className="owned-pill">{listing.quantity} in stock</span>
          </div>

          {orderSuccess ? (
            <div className="bg-[#e3f1e9] p-5 rounded-2xl border border-[#b9d1c3] space-y-3">
              <div className="flex items-center gap-2 text-[#0d4f38] font-bold text-sm">
                <Icon name="check" />
                <span>Order Placed! Demo Escrow Held</span>
              </div>
              <p className="text-xs text-[#667069] leading-relaxed">
                Order #{orderSuccess.id.slice(0, 10)} is confirmed. Simulated payment of ₹{orderSuccess.amount} is held until physical handover is confirmed.
              </p>
              <Link
                href={`/handover/${orderSuccess.id}`}
                className="button button-primary full-button"
              >
                Proceed to Handover Verification <Icon name="arrow" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-[#dfe3dc]">
                <span className="text-xs font-bold text-[#667069]">Quantity:</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setOrderQty(Math.max(1, orderQty - 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-[#dfe3dc] font-bold text-slate-700"
                  >
                    -
                  </button>
                  <span className="font-bold text-base">{orderQty}</span>
                  <button
                    onClick={() => setOrderQty(Math.min(listing.quantity, orderQty + 1))}
                    className="w-8 h-8 rounded-lg bg-white border border-[#dfe3dc] font-bold text-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-2 text-sm font-bold">
                <span>Total Simulation Amount:</span>
                <span className="text-lg text-[#176b4c]">₹{totalPrice}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isOrdering || listing.quantity <= 0}
                className="button button-primary full-button"
              >
                {isOrdering ? 'Holding Escrow...' : (isDonate ? 'Claim Free Donation' : (isRent ? 'Reserve for Rent' : 'Buy with Demo Escrow'))}
                <Icon name="arrow" />
              </button>

              <div className="reuse-estimate">
                <Icon name="scale" />
                <div>
                  <strong>~{listing.mass_g * orderQty} g waste diverted</strong>
                  <span>Direct physical mass saved from scrap</span>
                </div>
              </div>

              <p className="bom-note">
                Handover requires dual OTP exchange before final inventory settlement.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
