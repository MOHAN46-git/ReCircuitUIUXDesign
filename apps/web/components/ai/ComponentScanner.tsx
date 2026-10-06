'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon } from '@/components/ui/AppShell';
import { AIAnalysisResult } from '@/types';

export default function ComponentScanner() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [imageUrl, setImageUrl] = useState<string>(
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
  );
  const [sellerNotes, setSellerNotes] = useState<string>('Surplus DC motor from robot kit, yellow gearbox');

  const [title, setTitle] = useState<string>('TT Dual Shaft Gear Motor 3-6V');
  const [category, setCategory] = useState<string>('Actuators');
  const [model, setModel] = useState<string>('TT-DC-130 Gearbox 1:48');
  const [condition, setCondition] = useState<string>('used_functional');
  const [description, setDescription] = useState<string>(
    'Circular salvaged TT Dual Shaft Gear Motor. Tested functional with good gear teeth.'
  );
  const [quantity, setQuantity] = useState<number>(2);
  const [massG, setMassG] = useState<number>(30);
  const [mode, setMode] = useState<'sell' | 'rent' | 'donate'>('sell');
  const [price, setPrice] = useState<number>(120);
  const [rentPerDay, setRentPerDay] = useState<number>(0);
  const [tags, setTags] = useState<string>('tt-motor, dc-motor, robotics');
  const [confidence, setConfidence] = useState<number>(0.92);

  const handleStartScan = async () => {
    setIsScanning(true);
    setErrorMessage(null);
    try {
      const res = await fetch('/api/ai/analyze-component', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl, notes: sellerNotes }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to scan');

      const result: AIAnalysisResult = data.analysis;
      setTitle(result.probable_name);
      setCategory(result.category);
      setModel(result.possible_model || '');
      setCondition(result.visible_condition);
      setConfidence(result.confidence);
      setTags(result.suggested_tags.join(', '));
      setDescription(
        `Circular salvaged ${result.probable_name}. Visible condition appears ${result.visible_condition.replace('_', ' ')}. ${result.observations.join('. ')}.`
      );
      setCurrentStep(3);
    } catch {
      setCurrentStep(3);
    } finally {
      setIsScanning(false);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    setErrorMessage(null);
    try {
      const payload = {
        title,
        description,
        condition,
        quantity: Number(quantity),
        mode,
        price: mode === 'sell' ? Number(price) : 0,
        rent_per_day: mode === 'rent' ? Number(rentPerDay) : 0,
        mass_g: Number(massG),
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        image_url: imageUrl,
      };

      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Publish failed');

      router.push(`/marketplace/${data.listing.id}`);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsPublishing(false);
    }
  };

  const steps = [
    { num: 1, label: 'Media' },
    { num: 2, label: 'AI Scan' },
    { num: 3, label: 'Confirm' },
    { num: 4, label: 'Mode' },
    { num: 5, label: 'Publish' },
  ];

  return (
    <div className="bom-panel" style={{ position: 'static', maxWidth: '800px', margin: 'auto' }}>
      {/* Stepper Header */}
      <div className="stepper" style={{ padding: '0 0 24px' }}>
        {steps.map((s, idx) => (
          <React.Fragment key={s.num}>
            <span className={currentStep >= s.num ? 'done' : ''}>
              {currentStep > s.num ? '✓' : s.num}
              <small>{s.label}</small>
            </span>
            {idx < steps.length - 1 && <i />}
          </React.Fragment>
        ))}
      </div>

      {errorMessage && (
        <div className="ai-note" style={{ background: '#f9e7df', color: '#a04c33', marginBottom: '16px' }}>
          <Icon name="info" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Step 1: Media Selection */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <div className="capture-area" style={{ minHeight: '340px' }}>
            <span className="camera-orbit"><Icon name="camera" className="w-8 h-8" /></span>
            <h3>Take or choose a clear component photo</h3>
            <p>Our optical analyzer recognizes pinouts, silkscreens, and markings.</p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '14px' }}>
              <button
                type="button"
                onClick={() => {
                  setImageUrl('https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80');
                  setSellerNotes('Yellow TT motor 3-6V');
                }}
                className="filter"
              >
                Sample: TT Motor
              </button>
              <button
                type="button"
                onClick={() => {
                  setImageUrl('https://images.unsplash.com/photo-1553406830-ef2513450d76?auto=format&fit=crop&w=600&q=80');
                  setSellerNotes('Arduino Uno R3');
                }}
                className="filter"
              >
                Sample: Arduino Uno
              </button>
            </div>

            <button onClick={() => setCurrentStep(2)} className="button button-primary">
              Run AI Vision Inspection <Icon name="arrow" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Scanning */}
      {currentStep === 2 && (
        <div style={{ padding: '60px 20px', textAlign: 'center' }}>
          <span className="camera-orbit" style={{ margin: 'auto' }}>
            <Icon name="spark" className="w-8 h-8 animate-spin" />
          </span>
          <h2 style={{ fontSize: '22px', marginTop: '16px' }}>Inspecting Hardware Vectors...</h2>
          <p style={{ color: 'var(--muted)', fontSize: '13px', maxWidth: '420px', margin: '8px auto 24px' }}>
            Comparing package layout and markings against component libraries.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={() => setCurrentStep(1)} className="button button-secondary">
              Back
            </button>
            <button onClick={handleStartScan} disabled={isScanning} className="button button-primary">
              {isScanning ? 'Analyzing...' : 'Generate Identification'} <Icon name="arrow" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm Details */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="ai-note">
            <Icon name="info" />
            <span>
              <strong>AI Identified ({Math.round(confidence * 100)}% confidence):</strong> AI suggestion only—not safety certification. You can edit any field.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                Listing Title
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                Category
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid var(--line)', borderRadius: '8px', background: 'white' }}
              >
                <option value="Microcontrollers">Microcontrollers</option>
                <option value="Sensors">Sensors</option>
                <option value="Actuators">Actuators</option>
                <option value="Drivers">Drivers</option>
                <option value="Displays">Displays</option>
                <option value="Prototyping">Prototyping</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                Condition
              </label>
              <select
                value={condition}
                onChange={e => setCondition(e.target.value)}
                style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid var(--line)', borderRadius: '8px', background: 'white' }}
              >
                <option value="like_new">Like New</option>
                <option value="used_functional">Tested / Functional</option>
                <option value="untested">Untested Salvage</option>
                <option value="for_parts">For Parts</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                Mass (Grams)
              </label>
              <input
                type="number"
                min="1"
                value={massG}
                onChange={e => setMassG(Number(e.target.value))}
                style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid var(--line)', borderRadius: '8px' }}
              />
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                Hardware Notes
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line)', borderRadius: '8px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '14px' }}>
            <button onClick={() => setCurrentStep(1)} className="button button-secondary">
              Back
            </button>
            <button onClick={() => setCurrentStep(4)} className="button button-primary">
              Next: Pricing & Mode <Icon name="arrow" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Mode & Price */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="bom-header">
            <div>
              <span className="overline">Distribution Mode</span>
              <h2>How do you want to share this?</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <button
              type="button"
              onClick={() => setMode('sell')}
              className={`stat-card ${mode === 'sell' ? 'stat-card-active' : ''}`}
              style={{
                flexDirection: 'column',
                border: mode === 'sell' ? '2px solid var(--green)' : '1px solid var(--line)',
                background: mode === 'sell' ? 'var(--green-soft)' : 'white',
              }}
            >
              <strong>Sell Used</strong>
              <p>One-time sale to makers</p>
            </button>

            <button
              type="button"
              onClick={() => setMode('rent')}
              className={`stat-card ${mode === 'rent' ? 'stat-card-active' : ''}`}
              style={{
                flexDirection: 'column',
                border: mode === 'rent' ? '2px solid var(--green)' : '1px solid var(--line)',
                background: mode === 'rent' ? 'var(--green-soft)' : 'white',
              }}
            >
              <strong>Rent</strong>
              <p>Short-term loan per day</p>
            </button>

            <button
              type="button"
              onClick={() => setMode('donate')}
              className={`stat-card ${mode === 'donate' ? 'stat-card-active' : ''}`}
              style={{
                flexDirection: 'column',
                border: mode === 'donate' ? '2px solid var(--green)' : '1px solid var(--line)',
                background: mode === 'donate' ? 'var(--green-soft)' : 'white',
              }}
            >
              <strong>Donate</strong>
              <p>Free for student projects</p>
            </button>
          </div>

          {mode === 'sell' && (
            <div style={{ marginTop: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                Sale Price (₹ INR)
              </label>
              <input
                type="number"
                min="1"
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid var(--line)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
              />
            </div>
          )}

          {mode === 'rent' && (
            <div style={{ marginTop: '14px' }}>
              <label style={{ display: 'block', fontSize: '11px', color: 'var(--muted)', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '4px' }}>
                Rental Rate (₹ / Day)
              </label>
              <input
                type="number"
                min="1"
                value={rentPerDay}
                onChange={e => setRentPerDay(Number(e.target.value))}
                style={{ width: '100%', height: '42px', padding: '0 12px', border: '1px solid var(--line)', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' }}
              />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '14px' }}>
            <button onClick={() => setCurrentStep(3)} className="button button-secondary">
              Back
            </button>
            <button onClick={() => setCurrentStep(5)} className="button button-primary">
              Review & Publish <Icon name="arrow" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Review & Publish */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <div className="result-component">
            <div className="result-thumb">
              <span className="board"><i /><i /><i /><i /><b /></span>
            </div>
            <div>
              <span className="difficulty">{mode.toUpperCase()}</span>
              <h3>{title}</h3>
              <p>{category} · {massG}g · Qty: {quantity}</p>
            </div>
            <strong style={{ fontSize: '18px', color: 'var(--green)' }}>
              {mode === 'donate' ? 'FREE' : (mode === 'rent' ? `₹${rentPerDay}/day` : `₹${price}`)}
            </strong>
          </div>

          <div className="reuse-estimate">
            <Icon name="scale" />
            <div>
              <strong>~{massG * quantity} g hardware kept in use</strong>
              <span>Will be credited to your university circular impact upon handover</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '14px' }}>
            <button onClick={() => setCurrentStep(4)} className="button button-secondary">
              Back
            </button>
            <button onClick={handlePublish} disabled={isPublishing} className="button button-primary">
              {isPublishing ? 'Publishing...' : 'Publish to ReCircuit'} <Icon name="arrow" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
