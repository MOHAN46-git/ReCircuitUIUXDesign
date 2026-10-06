'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Icon, ProjectVisual, ScanPanel } from '@/components/ui/AppShell';
import { ProjectFeasibility } from '@/types';

const photo =
  'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=85&w=1200';

export default function DashboardPage() {
  const router = useRouter();
  const [scanOpen, setScanOpen] = useState(false);
  const [feasibilityProjects, setFeasibilityProjects] = useState<ProjectFeasibility[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setFeasibilityProjects(data.projects);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const defaultProjects = [
    {
      id: 'p0000001-0000-0000-0000-000000000001',
      title: 'Smart Plant Guardian',
      description: 'Monitor soil moisture and keep houseplants thriving automatically.',
      level: 'Beginner',
      parts: 5,
      matched: 4,
      score: 80,
      mass: '280 g',
      accent: 'plant',
    },
    {
      id: 'p0000002-0000-0000-0000-000000000002',
      title: 'Obstacle Avoiding Rover',
      description: 'Ultrasonic rangefinder vehicle avoiding barriers with differential drive.',
      level: 'Intermediate',
      parts: 6,
      matched: 4,
      score: 67,
      mass: '390 g',
      accent: 'air',
    },
    {
      id: 'p0000003-0000-0000-0000-000000000003',
      title: 'Bluetooth RC Rover',
      description: 'Motorized chassis driven wirelessly via smartphone BLE commands.',
      level: 'Beginner',
      parts: 4,
      matched: 3,
      score: 75,
      mass: '320 g',
      accent: 'solar',
    },
  ];

  return (
    <>
      {/* 1. Hero Section */}
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">
            <Icon name="spark" className="w-4 h-4" /> Make something useful today
          </span>
          <h1>
            Give every component<br />
            <em>another circuit.</em>
          </h1>
          <p>
            Turn spare electronics into useful builds. Scan what you have, find what it can become, and source only what’s missing.
          </p>
          <div className="hero-actions">
            <button
              onClick={() => setScanOpen(true)}
              className="button button-primary"
            >
              <Icon name="scan" />Scan / Add Component
            </button>
            <Link
              href="/projects"
              className="button button-secondary"
            >
              Find a Project <Icon name="arrow" />
            </Link>
          </div>
          <span className="microcopy">
            <Icon name="leaf" className="w-4 h-4" /> Reuse first. Buy only what you need.
          </span>
        </div>

        <div className="hero-image">
          <img src={photo} alt="Circuit boards and electronic components on a maker workbench" />
          <div className="scan-frame"><i /><i /><i /><i /></div>
          <div className="identified-chip">
            <span><Icon name="check" className="w-4 h-4" /></span>
            <div>
              <small>Component identified</small>
              <strong>Arduino Uno R3</strong>
            </div>
            <b>High match</b>
          </div>
          <span className="photo-credit">Photo by Robin Glauser · Unsplash</span>
        </div>
      </section>

      {/* 2. Circular Impact Section */}
      <section aria-labelledby="impact-heading" className="section-block">
        <div className="section-heading compact">
          <div>
            <span className="overline">Your circular impact</span>
            <h2 id="impact-heading">Small parts. Real progress.</h2>
          </div>
          <Link href="/impact" className="button button-ghost font-bold text-xs flex items-center gap-1">
            View impact report <Icon name="arrow" className="w-4 h-4" />
          </Link>
        </div>

        <div className="stats-grid">
          {[
            ['box', 'Components reused', '12', '+3 this month', 'mint'],
            ['scale', 'Waste diverted', '1.84 kg', 'Estimated by item mass', 'yellow'],
            ['wrench', 'Projects enabled', '4', '2 in progress', 'blue'],
            ['wallet', 'Saved by reuse', '₹2,450', 'vs. typical new prices', 'peach'],
          ].map(([icon, label, value, note, color]) => (
            <article className="stat-card" key={label}>
              <span className={`stat-icon ${color}`}>
                <Icon name={icon as any} />
              </span>
              <div>
                <p>{label}</p>
                <strong>{value}</strong>
                <small>{note}</small>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Ready-to-build Matches */}
      <section aria-labelledby="matches-heading" className="section-block">
        <div className="section-heading">
          <div>
            <span className="overline">Based on your components</span>
            <h2 id="matches-heading">Ready-to-build matches</h2>
            <p>Feasibility considers parts you own, required tools, and build complexity.</p>
          </div>
          <Link href="/projects" className="button button-ghost font-bold text-xs flex items-center gap-1">
            Browse all projects <Icon name="arrow" className="w-4 h-4" />
          </Link>
        </div>

        <div className="project-grid">
          {defaultProjects.map((project) => (
            <article className="project-card" key={project.title}>
              <ProjectVisual type={project.accent} />
              <div className="project-body">
                <div className="card-topline">
                  <span className="difficulty">{project.level}</span>
                  <button aria-label={`Save ${project.title}`} className="save-button">♡</button>
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="match-row">
                  <span>
                    <Icon name="box" className="w-4 h-4" />
                    {project.matched} of {project.parts} parts matched
                  </span>
                  <strong>{project.score}%</strong>
                </div>
                <div className="progress">
                  <span style={{ width: `${project.score}%` }} />
                </div>
                <div className="project-foot">
                  <span>
                    <Icon name="scale" className="w-4 h-4" />
                    ~{project.mass} reused
                  </span>
                  <button onClick={() => router.push(`/projects/${project.id}`)}>
                    View project <Icon name="arrow" className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Workbench Banner */}
      <section className="workbench-banner">
        <span className="banner-icon"><Icon name="camera" /></span>
        <div>
          <span className="overline">Your workbench is waiting</span>
          <h2>Found a loose component?</h2>
          <p>Scan it in seconds. We’ll identify it, explain the result, and show what you can build.</p>
        </div>
        <button onClick={() => setScanOpen(true)} className="button">
          Scan your first part <Icon name="arrow" />
        </button>
      </section>

      {/* Scan Modal */}
      {scanOpen && <ScanPanel close={() => setScanOpen(false)} />}
    </>
  );
}
