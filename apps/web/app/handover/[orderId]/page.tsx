'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/AppShell';
import { Order } from '@/types';

export default function HandoverPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [buyerInputCode, setBuyerInputCode] = useState('');
  const [sellerInputCode, setSellerInputCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const found = data.orders.find((o: Order) => o.id === orderId);
          if (found) setOrder(found);
          else setError('Order not found');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [orderId]);

  const verifyCode = async (role: 'buyer' | 'seller', code: string) => {
    if (!code || code.length !== 4) {
      alert('Please enter a 4-digit code');
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/handover/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, code, role }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Verification failed');
      setStatusMessage(data.message);
      setOrder(data.order);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="placeholder">
        <span className="banner-icon"><Icon name="scale" /></span>
        <p>Loading handover verification...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="placeholder">
        <span className="banner-icon"><Icon name="info" /></span>
        <h1>Order Not Found</h1>
        <Link href="/orders" className="button button-secondary">
          Return to orders
        </Link>
      </div>
    );
  }

  const isCompleted = order.status === 'completed';
  const handover = order.handover;

  return (
    <section className="detail-page">
      <button className="back-link" onClick={() => router.push('/orders')}>
        ← Back to orders
      </button>

      <div className="page-intro">
        <div>
          <span className="eyebrow">
            <Icon name="check" className="w-4 h-4" /> Dual-confirmation handover
          </span>
          <h1>Order #{order.id.slice(0, 10)}</h1>
          <p>Item: {order.listing?.title} · Quantity: {order.qty}</p>
        </div>
        <span className={isCompleted ? 'status-owned' : 'status-missing'}>
          {isCompleted ? 'RELEASED_DEMO' : 'PAYMENT_HELD_DEMO (₹' + order.amount + ')'}
        </span>
      </div>

      {statusMessage && (
        <div className="ai-note" style={{ background: 'var(--green-soft)', color: 'var(--green-dark)' }}>
          <Icon name="check" />
          <span>{statusMessage}</span>
        </div>
      )}

      {isCompleted ? (
        <div className="why-match" style={{ padding: '36px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
          <span className="stat-icon mint" style={{ width: '60px', height: '60px', margin: 'auto' }}>
            <Icon name="check" className="w-8 h-8 text-[#176b4c]" />
          </span>
          <h2 style={{ fontSize: '24px', marginTop: '14px' }}>Handover Verified & Completed!</h2>
          <p style={{ color: 'var(--muted)', maxWidth: '440px', margin: '8px auto 20px', fontSize: '13px' }}>
            Both codes confirmed. Stock has been updated, hardware mass recorded, and the component is now in your active inventory.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/projects" className="button button-primary">
              Re-run project matches with your new part <Icon name="arrow" />
            </Link>
            <Link href="/impact" className="button button-secondary">
              View impact report
            </Link>
          </div>
        </div>
      ) : (
        <div className="detail-grid">
          {/* Buyer Box */}
          <div className="bom-panel" style={{ position: 'static' }}>
            <div className="bom-header">
              <div>
                <span className="overline">Buyer Verification</span>
                <h2>Code: {handover?.buyer_hash || '7492'}</h2>
              </div>
              <span className={handover?.buyer_verified_at ? 'status-owned' : 'status-missing'}>
                {handover?.buyer_verified_at ? 'Verified' : 'Pending'}
              </span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '16px' }}>
              Present this code to the seller when receiving the component in person.
            </p>
            {!handover?.buyer_verified_at && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  maxLength={4}
                  value={buyerInputCode}
                  onChange={e => setBuyerInputCode(e.target.value)}
                  placeholder="e.g. 7492"
                  style={{
                    flex: 1,
                    height: '42px',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                  }}
                />
                <button
                  onClick={() => verifyCode('buyer', buyerInputCode || handover?.buyer_hash || '7492')}
                  disabled={submitting}
                  className="button button-primary"
                  style={{ minHeight: '42px' }}
                >
                  Verify Buyer
                </button>
              </div>
            )}
          </div>

          {/* Seller Box */}
          <div className="bom-panel" style={{ position: 'static' }}>
            <div className="bom-header">
              <div>
                <span className="overline">Seller Verification</span>
                <h2>Code: {handover?.seller_hash || '5184'}</h2>
              </div>
              <span className={handover?.seller_verified_at ? 'status-owned' : 'status-missing'}>
                {handover?.seller_verified_at ? 'Verified' : 'Pending'}
              </span>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: '12px', marginBottom: '16px' }}>
              Present this code to the buyer to unlock and release simulated escrow funds.
            </p>
            {!handover?.seller_verified_at && (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  maxLength={4}
                  value={sellerInputCode}
                  onChange={e => setSellerInputCode(e.target.value)}
                  placeholder="e.g. 5184"
                  style={{
                    flex: 1,
                    height: '42px',
                    border: '1px solid var(--line)',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                  }}
                />
                <button
                  onClick={() => verifyCode('seller', sellerInputCode || handover?.seller_hash || '5184')}
                  disabled={submitting}
                  className="button button-secondary"
                  style={{ minHeight: '42px' }}
                >
                  Verify Seller
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
