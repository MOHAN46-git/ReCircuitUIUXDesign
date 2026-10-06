'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Icon, ProjectVisual } from '@/components/ui/AppShell';
import { ProjectFeasibility } from '@/types';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [feasibility, setFeasibility] = useState<ProjectFeasibility | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!projectId) return;

    fetch(`/api/projects/${projectId}/match`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeasibility(data.feasibility);
        } else {
          setError(data.error || 'Failed to load project details');
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [projectId]);

  if (loading) {
    return (
      <div className="placeholder">
        <span className="banner-icon"><Icon name="wrench" /></span>
        <p>Loading Bill of Materials and hardware match...</p>
      </div>
    );
  }

  if (error || !feasibility) {
    return (
      <section className="placeholder">
        <span className="banner-icon"><Icon name="info" /></span>
        <h1>Project Not Found</h1>
        <p>{error || 'Could not retrieve project requirements.'}</p>
        <Link href="/projects" className="button button-secondary">
          Return to project library
        </Link>
      </section>
    );
  }

  const { project, boms, score, is_buildable, reusable_mass_g, missing_items } = feasibility;

  // Choose accent visual based on project category or slug
  const visualType = project.slug.includes('irrigation') || project.slug.includes('plant')
    ? 'plant'
    : (project.slug.includes('solar') || project.slug.includes('car') ? 'solar' : 'air');

  return (
    <section className="detail-page">
      <button className="back-link" onClick={() => router.push('/projects')}>
        ← Back to project matches
      </button>

      <div className="detail-grid">
        {/* Left Column: Visual, Description & Match Rationale */}
        <div>
          <ProjectVisual type={visualType} large />
          <div className="detail-title">
            <span className="difficulty">{project.difficulty} · 1–2 hours</span>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
          </div>

          <div className="why-match">
            <div className="score-ring">
              <strong>{score}%</strong>
              <span>feasible</span>
            </div>
            <div>
              <h2>Why this is a strong match</h2>
              <ul>
                <li>
                  <Icon name="check" />
                  <span>You own {feasibility.matched_items_count} of {feasibility.total_items_count} required components</span>
                </li>
                <li>
                  <Icon name="check" />
                  <span>Verified pinout & standard 5V logic compatibility</span>
                </li>
                {missing_items.length > 0 ? (
                  <li>
                    <Icon name="info" />
                    <span>Missing parts ({missing_items.length}) available from local campus donors</span>
                  </li>
                ) : (
                  <li>
                    <Icon name="check" />
                    <span>100% complete! No additional hardware purchases needed</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Bill of Materials (BOM) Panel */}
        <div className="bom-panel">
          <div className="bom-header">
            <div>
              <span className="overline">Bill of materials</span>
              <h2>{feasibility.total_items_count} components required</h2>
            </div>
            <span className="owned-pill">{feasibility.matched_items_count} available</span>
          </div>

          <div className="bom-table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Component</th>
                  <th>Req.</th>
                  <th>Have</th>
                  <th>Status</th>
                  <th>Marketplace</th>
                </tr>
              </thead>
              <tbody>
                {boms.map((item, index) => {
                  const isOwned = item.status === 'HAVE';
                  return (
                    <tr key={item.component_id || index}>
                      <td>{item.canonical_name}</td>
                      <td>{item.required_qty}</td>
                      <td>{item.available_qty}</td>
                      <td>
                        <span className={isOwned ? 'status-owned' : 'status-missing'}>
                          {isOwned ? 'Owned' : 'Missing'}
                        </span>
                      </td>
                      <td>
                        {isOwned ? (
                          '—'
                        ) : (
                          <Link
                            href={`/marketplace?q=${encodeURIComponent(item.canonical_name)}`}
                            className="font-bold hover:underline"
                          >
                            Find in market →
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="reuse-estimate">
            <Icon name="scale" />
            <div>
              <strong>~{reusable_mass_g} g kept in use</strong>
              <span>Estimated from typical component mass</span>
            </div>
          </div>

          {missing_items.length > 0 ? (
            <Link
              href={`/marketplace?q=${encodeURIComponent(missing_items[0].canonical_name)}`}
              className="button button-primary full-button"
            >
              Find {missing_items.length} missing parts <Icon name="arrow" />
            </Link>
          ) : (
            <button
              onClick={() => alert('Starting build! Components allocated to your workbench.')}
              className="button button-primary full-button"
            >
              Start Project Assembly <Icon name="arrow" />
            </button>
          )}

          <p className="bom-note">
            Marketplace results can be filtered by buy, rent, or donation.
          </p>
        </div>
      </div>
    </section>
  );
}
