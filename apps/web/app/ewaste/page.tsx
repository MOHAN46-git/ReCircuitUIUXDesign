'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/AppShell';
import { EWasteSubmission } from '@/types';

export default function EWastePage() {
  const [step, setStep] = useState<'decision' | 'form' | 'success'>('decision');
  const [category, setCategory] = useState('Printed Circuit Boards (PCBs)');
  const [weightG, setWeightG] = useState(650);
  const [route, setRoute] = useState<'recycling_partner_demo' | 'community_collection'>('recycling_partner_demo');
  const [notes, setNotes] = useState('Damaged power supply boards, non-functional');
  const [submitting, setSubmitting] = useState(false);
  const [recentSubmissions, setRecentSubmissions] = useState<EWasteSubmission[]>([]);
  const [submittedItem, setSubmittedItem] = useState<EWasteSubmission | null>(null);

  useEffect(() => {
    fetch('/api/ewaste')
      .then(res => res.json())
      .then(data => {
        if (data.success) setRecentSubmissions(data.ewaste);
      })
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/ewaste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          weight_g: Number(weightG),
          route,
          notes,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Submission failed');
      setSubmittedItem(data.submission);
      setStep('success');
      setRecentSubmissions(prev => [data.submission, ...prev]);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const estimatedValue = Math.round((weightG / 1000) * 140);

  return (
    <section className="page-section">
      <div className="page-intro">
        <div>
          <span className="eyebrow">
            <Icon name="scale" className="w-4 h-4" /> Circular e-waste intake
          </span>
          <h1>Zero-landfill recycling</h1>
          <p>
            Reuse first. If electronics are damaged beyond repair, route them to certified smelters for rare earth recovery.
          </p>
        </div>
      </div>

      {step === 'decision' && (
        <div className="why-match" style={{ padding: '36px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <span className="overline">Reuse-first question</span>
            <h2 style={{ fontSize: '24px', marginTop: '6px' }}>Can any part of this hardware still function?</h2>
            <p style={{ color: 'var(--muted)', fontSize: '13px', marginTop: '6px' }}>
              Even boards with burnt LEDs or damaged headers can often be used for student prototyping.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px', width: '100%' }}>
            <div className="stat-card" style={{ flexDirection: 'column', gap: '10px' }}>
              <span className="stat-icon mint">
                <Icon name="spark" className="w-5 h-5 text-[#176b4c]" />
              </span>
              <h3>Yes, it might still work</h3>
              <p>Scan it to discover compatible DIY projects or list for free student donation.</p>
              <Link href="/seller/listings/new" className="button button-primary" style={{ marginTop: '10px', width: '100%' }}>
                Scan for reuse <Icon name="arrow" />
              </Link>
            </div>

            <div className="stat-card" style={{ flexDirection: 'column', gap: '10px' }}>
              <span className="stat-icon peach">
                <Icon name="wrench" className="w-5 h-5 text-[#a04c33]" />
              </span>
              <h3>No, broken or unsafe</h3>
              <p>Cracked PCBs, severed coils, or burnt ICs. Route directly to shredding & recovery.</p>
              <button onClick={() => setStep('form')} className="button button-secondary" style={{ marginTop: '10px', width: '100%' }}>
                Continue to e-waste intake <Icon name="arrow" />
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'form' && (
        <form onSubmit={handleSubmit} className="bom-panel" style={{ position: 'static' }}>
          <div className="bom-header">
            <div>
              <span className="overline">Batch specifications</span>
              <h2>Log scrap electronics batch</h2>
            </div>
            <button type="button" onClick={() => setStep('decision')} className="back-link" style={{ padding: 0 }}>
              ← Change choice
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                Material Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid var(--line)', borderRadius: '9px', background: 'white' }}
              >
                <option value="Printed Circuit Boards (PCBs)">Printed Circuit Boards (PCBs)</option>
                <option value="Copper Wire & Cable Harnesses">Copper Wire & Cable Harnesses</option>
                <option value="Power Supplies & Transformers">Power Supplies & Transformers</option>
                <option value="Shattered Displays & Panels">Shattered Displays & Panels</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
                Batch Weight (Grams)
              </label>
              <input
                type="number"
                min="100"
                step="50"
                value={weightG}
                onChange={e => setWeightG(Number(e.target.value))}
                style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid var(--line)', borderRadius: '9px', background: 'white' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '6px' }}>
              Condition / Damage Notes
            </label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Severe water damage on board"
              style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid var(--line)', borderRadius: '9px', background: 'white' }}
            />
          </div>

          <div className="reuse-estimate">
            <Icon name="wallet" />
            <div>
              <strong>Estimated recovery value: ₹{estimatedValue}</strong>
              <span>Calculated from current metal recovery market estimates</span>
            </div>
          </div>

          <button type="submit" disabled={submitting} className="button button-primary full-button">
            {submitting ? 'Submitting Batch...' : 'Submit E-Waste for Recycling'} <Icon name="arrow" />
          </button>
        </form>
      )}

      {step === 'success' && submittedItem && (
        <div className="why-match" style={{ padding: '36px', textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
          <span className="stat-icon mint" style={{ width: '60px', height: '60px', margin: 'auto' }}>
            <Icon name="check" className="w-8 h-8 text-[#176b4c]" />
          </span>
          <h2 style={{ fontSize: '24px', marginTop: '14px' }}>Batch Registered!</h2>
          <p style={{ color: 'var(--muted)', maxWidth: '440px', margin: '8px auto 20px', fontSize: '13px' }}>
            Batch #{submittedItem.id.slice(0, 10)} ({submittedItem.weight_g} g) has been logged. ~{(submittedItem.weight_g / 1000).toFixed(2)} kg has been diverted from toxic landfill dumping.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button onClick={() => setStep('decision')} className="button button-secondary">
              Submit another batch
            </button>
            <Link href="/impact" className="button button-primary">
              View impact report <Icon name="arrow" />
            </Link>
          </div>
        </div>
      )}

      {/* Recent submissions table */}
      <div className="section-block">
        <div className="section-heading">
          <div>
            <span className="overline">Recent Intake</span>
            <h2>Aggregated campus scrap</h2>
          </div>
        </div>

        <div className="bom-panel" style={{ position: 'static' }}>
          <div className="bom-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Batch ID</th>
                  <th>Category</th>
                  <th>Mass</th>
                  <th>Value</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentSubmissions.map(item => (
                  <tr key={item.id}>
                    <td><strong>#{item.id.slice(0, 10)}</strong></td>
                    <td>{item.category}</td>
                    <td><strong>{item.weight_g} g</strong></td>
                    <td>₹{item.estimated_value}</td>
                    <td><span className="status-owned">{item.status.replace('_', ' ')}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
