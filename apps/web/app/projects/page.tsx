'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon, ProjectVisual } from '@/components/ui/AppShell';
import { ProjectFeasibility } from '@/types';

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<ProjectFeasibility[]>([]);
  const [filterType, setFilterType] = useState<'best' | 'beginner' | 'fast'>('best');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProjects(data.projects);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const getVisualAccent = (index: number): 'plant' | 'air' | 'solar' => {
    const accents: ('plant' | 'air' | 'solar')[] = ['plant', 'air', 'solar'];
    return accents[index % 3];
  };

  const filteredProjects = projects.filter(p => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.project.title.toLowerCase().includes(q) ||
        p.project.description.toLowerCase().includes(q) ||
        p.project.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (filterType === 'beginner') {
      return p.project.difficulty === 'Beginner';
    }
    if (filterType === 'best') {
      return p.score >= 50;
    }
    return true;
  });

  return (
    <section className="page-section">
      {/* Intro Header */}
      <div className="page-intro">
        <div>
          <span className="eyebrow">
            <Icon name="projects" className="w-4 h-4" /> Project library
          </span>
          <h1>Build more with what you have.</h1>
          <p>
            Every match is scored from your available parts, tool needs, and project difficulty.
          </p>
        </div>
        <button className="button button-secondary">
          <Icon name="box" />
          <span>My parts: 5</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="filter-row">
        <label>
          <Icon name="search" />
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            aria-label="Search projects"
            placeholder="What do you want to build?"
          />
        </label>
        <button
          onClick={() => setFilterType('best')}
          className={`filter ${filterType === 'best' ? 'active' : ''}`}
        >
          Best matches
        </button>
        <button
          onClick={() => setFilterType('beginner')}
          className={`filter ${filterType === 'beginner' ? 'active' : ''}`}
        >
          Beginner
        </button>
        <button
          onClick={() => setFilterType('fast')}
          className={`filter ${filterType === 'fast' ? 'active' : ''}`}
        >
          Under 1 hour
        </button>
      </div>

      {/* Projects Grid */}
      <div className="project-grid library-grid">
        {filteredProjects.map((fp, idx) => {
          const project = fp.project;
          const accent = getVisualAccent(idx);

          return (
            <article className="project-card" key={fp.project_id}>
              <ProjectVisual type={accent} />
              <div className="project-body">
                <div className="card-topline">
                  <span className="difficulty">{project.difficulty}</span>
                  <button aria-label={`Save ${project.title}`} className="save-button">
                    ♡
                  </button>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="match-row">
                  <span>
                    <Icon name="box" className="w-4 h-4" />
                    {fp.matched_items_count} of {fp.total_items_count} parts matched
                  </span>
                  <strong>{fp.score}%</strong>
                </div>
                <div className="progress">
                  <span style={{ width: `${fp.score}%` }} />
                </div>
                <div className="project-foot">
                  <span>
                    <Icon name="scale" className="w-4 h-4" />
                    ~{fp.reusable_mass_g} g reused
                  </span>
                  <button onClick={() => router.push(`/projects/${project.id}`)}>
                    View project <Icon name="arrow" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
