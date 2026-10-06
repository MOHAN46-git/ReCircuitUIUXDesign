'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/AppShell';
import { Order } from '@/types';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrders(data.orders);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="page-section">
      <div className="page-intro">
        <div>
          <span className="eyebrow">
            <Icon name="cart" className="w-4 h-4" /> Hardware ledger
          </span>
          <h1>Your orders & handover sessions</h1>
          <p>
            Track component acquisitions and exchange verification codes to complete dual-confirmation transfers.
          </p>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="placeholder">
          <span className="banner-icon"><Icon name="box" /></span>
          <h3>No orders placed yet</h3>
          <p>Browse the marketplace or project BOMs to acquire components.</p>
          <Link href="/marketplace" className="button button-primary">
            Browse marketplace <Icon name="arrow" />
          </Link>
        </div>
      ) : (
        <div className="bom-panel" style={{ position: 'static' }}>
          <div className="bom-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Component</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Handover Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const isCompleted = order.status === 'completed';
                  return (
                    <tr key={order.id}>
                      <td><strong>#{order.id.slice(0, 10)}</strong></td>
                      <td>
                        <strong>{order.listing?.title || 'Component Order'}</strong>
                        <div style={{ color: 'var(--muted)', fontSize: '10px' }}>
                          Seller: {order.seller?.first_name || 'Maker'}
                        </div>
                      </td>
                      <td>{order.qty}</td>
                      <td><strong>₹{order.amount}</strong></td>
                      <td>
                        <span className={isCompleted ? 'status-owned' : 'status-missing'}>
                          {isCompleted ? 'Completed' : 'Ready for Handover'}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => router.push(`/handover/${order.id}`)}
                          className="button button-secondary"
                          style={{ minHeight: '34px', fontSize: '12px', padding: '0 12px' }}
                        >
                          {isCompleted ? 'View receipt' : 'Enter code'} <Icon name="arrow" className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
