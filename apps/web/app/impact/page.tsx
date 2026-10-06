'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Icon } from '@/components/ui/AppShell';

export default function ImpactPage() {
  const stats = [
    { label: 'Components reused', value: '12 units', note: '+3 this month', icon: 'box', color: 'mint' },
    { label: 'Waste diverted', value: '1.84 kg', note: 'Empirical item mass', icon: 'scale', color: 'yellow' },
    { label: 'Projects enabled', value: '4 builds', note: '2 active on workbench', icon: 'wrench', color: 'blue' },
    { label: 'Saved by reuse', value: '₹2,450', note: 'vs. typical new prices', icon: 'wallet', color: 'peach' },
  ];

  const log = [
    { id: 'RC-104', type: 'Handover complete', item: 'Arduino Uno R3', mass: '45 g', impact: 'Direct reuse' },
    { id: 'RC-103', type: 'Handover complete', item: 'Soil Moisture Sensor', mass: '20 g', impact: 'Direct reuse' },
    { id: 'RC-102', type: 'E-Waste recycled', item: 'PCB Scrap Batch', mass: '850 g', impact: 'Copper recovery' },
    { id: 'RC-101', type: 'Donation claimed', item: 'Breadboard & Wires', mass: '95 g', impact: 'Student build' },
  ];

  return (
    <section className="page-section">
      <div className="page-intro">
        <div>
          <span className="eyebrow">
            <Icon name="impact" className="w-4 h-4" /> Circular impact report
          </span>
          <h1>Small parts. Real progress.</h1>
          <p>
            ReCircuit calculates waste reduction based on empirical hardware mass kept in circulation.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="stats-grid">
        {stats.map(s => (
          <article className="stat-card" key={s.label}>
            <span className={`stat-icon ${s.color}`}>
              <Icon name={s.icon as any} />
            </span>
            <div>
              <p>{s.label}</p>
              <strong>{s.value}</strong>
              <small>{s.note}</small>
            </div>
          </article>
        ))}
      </div>

      {/* Methodology Section */}
      <div className="section-block">
        <div className="why-match">
          <span className="stat-icon mint">
            <Icon name="leaf" className="w-6 h-6 text-[#176b4c]" />
          </span>
          <div>
            <h2>How your impact is measured</h2>
            <ul>
              <li>
                <Icon name="check" />
                <span>Every catalog component has a verified physical gram measurement</span>
              </li>
              <li>
                <Icon name="check" />
                <span>Mass is credited only upon successful dual-confirmation physical handover</span>
              </li>
              <li>
                <Icon name="info" />
                <span>Approx ~1.8 kg CO₂ eq. avoided per 1 kg of active electronics kept in circulation</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Audited Diversion Log */}
      <div className="section-block">
        <div className="section-heading">
          <div>
            <span className="overline">Audited records</span>
            <h2>Recent diversion events</h2>
          </div>
        </div>

        <div className="bom-panel" style={{ position: 'static' }}>
          <div className="bom-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Event ID</th>
                  <th>Action</th>
                  <th>Hardware Item</th>
                  <th>Mass Diverted</th>
                  <th>Outcome</th>
                </tr>
              </thead>
              <tbody>
                {log.map(row => (
                  <tr key={row.id}>
                    <td><strong>{row.id}</strong></td>
                    <td>{row.type}</td>
                    <td>{row.item}</td>
                    <td><strong>{row.mass}</strong></td>
                    <td><span className="status-owned">{row.impact}</span></td>
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
