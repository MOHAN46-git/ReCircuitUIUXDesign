import React from 'react';
import { Icon } from '@/components/ui/AppShell';
import ComponentScanner from '@/components/ai/ComponentScanner';

export default function NewListingPage() {
  return (
    <section className="page-section">
      <div className="page-intro" style={{ marginBottom: '24px' }}>
        <div>
          <span className="eyebrow">
            <Icon name="scan" className="w-4 h-4" /> Add component
          </span>
          <h1>Scan & List Electronics</h1>
          <p>
            Upload a photo of salvaged boards or surplus components. AI assists with identification and visible inspection.
          </p>
        </div>
      </div>

      <ComponentScanner />
    </section>
  );
}
