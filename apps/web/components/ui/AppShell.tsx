'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Profile } from '@/types';

export type IconName =
  | 'home'
  | 'scan'
  | 'spark'
  | 'market'
  | 'projects'
  | 'impact'
  | 'user'
  | 'bell'
  | 'arrow'
  | 'check'
  | 'close'
  | 'search'
  | 'box'
  | 'scale'
  | 'wrench'
  | 'wallet'
  | 'leaf'
  | 'camera'
  | 'info'
  | 'cart';

export function Icon({ name, className = 'w-5 h-5' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, ReactNode> = {
    home: <><path d="m3 11 9-8 9 8" /><path d="M5 10v10h14V10M9 20v-6h6v6" /></>,
    scan: <><path d="M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4" /><path d="M8 12h8M12 8v8" /></>,
    spark: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" /><path d="m5 15 .7 2.3L8 18l-2.3.7L5 21l-.7-2.3L2 18l2.3-.7L5 15Z" /></>,
    market: <><path d="M4 9h16l-1-5H5L4 9Z" /><path d="M5 9v11h14V9M9 20v-6h6v6" /><path d="M4 9c0 2 3 2 4 0 1 2 3 2 4 0 1 2 3 2 4 0 1 2 4 2 4 0" /></>,
    projects: <><path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" /><path d="M17 14v6M14 17h6" /></>,
    impact: <><path d="M20 4C11 4 5 8 5 14c0 3 2 5 5 5 6 0 9-6 10-15Z" /><path d="M4 21c2-6 7-10 13-13" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21c.7-5 3.3-7 8-7s7.3 2 8 7" /></>,
    bell: <><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" /><path d="M10 21h4" /></>,
    arrow: <><path d="M5 12h14M14 7l5 5-5 5" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <path d="M6 6l12 12M18 6 6 18" />,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    box: <><path d="m4 7 8-4 8 4-8 4-8-4Z" /><path d="m4 7 8 4 8-4v10l-8 4-8-4V7Z" /><path d="M12 11v10" /></>,
    scale: <><path d="M6 20h12M12 4v16M5 7h14" /><path d="m5 7-3 6h6L5 7ZM19 7l-3 6h6l-3-6Z" /></>,
    wrench: <path d="M14 6a4 4 0 0 0-5 5L3 17l4 4 6-6a4 4 0 0 0 5-5l-3 3-4-4 3-3Z" />,
    wallet: <><path d="M3 6h16v14H3z" /><path d="M3 9h18v7h-6a3 3 0 0 1 0-6h6" /></>,
    leaf: <><path d="M20 4C11 4 6 8 6 14c0 3 2 5 5 5 6 0 8-7 9-15Z" /><path d="M4 21c3-6 7-10 13-13" /></>,
    camera: <><path d="M4 7h4l2-3h4l2 3h4v12H4z" /><circle cx="12" cy="13" r="4" /></>,
    info: <><circle cx="12" cy="12" r="9" /><path d="M12 11v6M12 7h.01" /></>,
    cart: <><path d="M3 4h2l2 11h10l3-8H6" /><circle cx="9" cy="20" r="1" /><circle cx="17" cy="20" r="1" /></>,
  };
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

export function Logo() {
  return (
    <Link href="/" className="logo-wrap">
      <span className="logo-mark"><Icon name="leaf" className="w-5 h-5" /></span>
      <span className="logo-text">Re<span>Circuit</span></span>
    </Link>
  );
}

export function ProjectVisual({ type, large = false }: { type: string; large?: boolean }) {
  return (
    <div className={`project-visual ${type} ${large ? 'large' : ''}`}>
      <span className="board"><i /><i /><i /><i /><b /></span>
      {type === 'plant' && <span className="plant-stem"><i /><i /><i /></span>}
      {type === 'air' && <span className="air-lines"><i /><i /><i /></span>}
      {type === 'solar' && <span className="solar-panel"><i /><i /><i /></span>}
    </div>
  );
}

export function ScanPanel({
  close,
  onSelectProject,
}: {
  close: () => void;
  onSelectProject?: (slug: string) => void;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);

  return (
    <div className="modal-backdrop" role="presentation" onClick={e => {
      if (e.target === e.currentTarget) close();
    }}>
      <section className="scan-panel" role="dialog" aria-modal="true" aria-labelledby="scan-title">
        <div className="panel-head">
          <div>
            <span className="eyebrow"><Icon name="scan" className="w-4 h-4" />Add component</span>
            <h2 id="scan-title">{step === 0 ? 'What are we working with?' : 'Component identified'}</h2>
          </div>
          <button onClick={close} className="icon-button" aria-label="Close scan panel">
            <Icon name="close" />
          </button>
        </div>

        <div className="stepper" aria-label="Listing progress">
          <span className="done">1 <small>Media</small></span>
          <i />
          <span className={step > 0 ? 'done' : ''}>2 <small>AI scan</small></span>
          <i />
          <span>3 <small>Confirm</small></span>
          <i />
          <span>4 <small>Match</small></span>
        </div>

        {step === 0 ? (
          <div className="capture-area">
            <span className="camera-orbit"><Icon name="camera" className="w-8 h-8" /></span>
            <h3>Take a clear photo of the component</h3>
            <p>Use good lighting and include any printed labels or model numbers.</p>
            <button
              onClick={() => setStep(1)}
              className="button button-primary"
            >
              <Icon name="camera" />Scan sample component
            </button>
            <button
              onClick={() => {
                close();
                router.push('/seller/listings/new');
              }}
              className="text-button"
            >
              or upload from device
            </button>
            <div className="privacy-note">
              <Icon name="info" />
              <span>Photos are used only to identify your component.</span>
            </div>
          </div>
        ) : (
          <div className="scan-result">
            <div className="result-component">
              <div className="result-thumb">
                <span className="board"><i /><i /><i /><i /><b /></span>
              </div>
              <div>
                <span className="confidence">High confidence</span>
                <h3>Arduino Uno R3</h3>
                <p>Microcontroller development board · ATmega328P</p>
              </div>
              <button onClick={() => {
                close();
                router.push('/seller/listings/new');
              }}>
                Edit
              </button>
            </div>

            <div className="ai-note">
              <Icon name="info" />
              <span>
                <strong>Why this match?</strong> The board shape, USB-B port, pin layout, and “UNO” marking match reference images. AI suggestion—not safety certification.
              </span>
            </div>

            <div className="found-match">
              <span className="overline">Best project match</span>
              <div>
                <ProjectVisual type="plant" />
                <section>
                  <span className="difficulty">Beginner</span>
                  <h3>Smart Plant Guardian</h3>
                  <p>You have 4 of 5 parts in inventory · ~280 g reusable</p>
                  <div className="match-explain">
                    <strong>80% feasible</strong>
                    <span>Deterministic BOM match + no special tools</span>
                  </div>
                </section>
              </div>
            </div>

            <button
              onClick={() => {
                close();
                router.push('/projects/p0000001-0000-0000-0000-000000000001');
              }}
              className="button button-primary full-button"
            >
              See project & missing parts <Icon name="arrow" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [scanOpen, setScanOpen] = useState(false);
  const [activeUser, setActiveUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setActiveUser(d.activeUser);
          setProfiles(d.availableUsers);
        }
      })
      .catch(() => {});
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const switchUser = async (userId: string) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveUser(data.activeUser);
        setShowUserDropdown(false);
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navItems: { path: string; icon: IconName; label: string; badge?: string }[] = [
    { path: '/', icon: 'home', label: 'Dashboard' },
    { path: '/marketplace', icon: 'market', label: 'Marketplace' },
    { path: '/projects', icon: 'projects', label: 'Projects' },
    { path: '/assistant', icon: 'spark', label: 'AI Assistant', badge: 'Beta' },
    { path: '/impact', icon: 'impact', label: 'Impact' },
  ];

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="sidebar">
        <Logo />
        <nav className="side-nav" aria-label="Primary navigation">
          <p className="nav-label">Workspace</p>
          {navItems.map(item => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon name={item.icon} />
                <span>{item.label}</span>
                {item.badge && <small>{item.badge}</small>}
              </Link>
            );
          })}

          <p className="nav-label nav-label-spaced">Manage</p>
          <Link
            href="/projects"
            className={`nav-item ${pathname.includes('inventory') ? 'active' : ''}`}
          >
            <Icon name="box" />
            <span>My components</span>
            <b>5</b>
          </Link>
          <Link
            href="/orders"
            className={`nav-item ${pathname.startsWith('/orders') || pathname.startsWith('/handover') ? 'active' : ''}`}
          >
            <Icon name="cart" />
            <span>Orders</span>
          </Link>
          <Link
            href="/ewaste"
            className={`nav-item ${pathname.startsWith('/ewaste') ? 'active' : ''}`}
          >
            <Icon name="scale" />
            <span>E-Waste</span>
          </Link>
        </nav>

        <div className="sidebar-foot relative">
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="profile-row"
            title="Switch demo persona"
          >
            <span className="avatar">
              {activeUser ? `${activeUser.first_name[0]}${activeUser.last_name[0]}` : 'VP'}
            </span>
            <span>
              <strong>{activeUser ? `${activeUser.first_name} ${activeUser.last_name}` : 'Vikram Patel'}</strong>
              <small>{activeUser?.organization || 'Saveetha Engineering'}</small>
            </span>
            <Icon name="arrow" className="w-4 h-4 text-slate-400" />
          </button>

          {showUserDropdown && (
            <div className="absolute bottom-16 left-0 right-0 bg-white border border-[#dfe3dc] rounded-xl shadow-xl p-2 z-50">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Demo Accounts
              </p>
              {profiles.map(p => (
                <button
                  key={p.id}
                  onClick={() => switchUser(p.id)}
                  className={`w-full text-left p-2 rounded-lg text-xs flex items-center justify-between hover:bg-[#eff1ec] ${
                    activeUser?.id === p.id ? 'bg-[#e3f1e9] text-[#0d4f38] font-bold' : 'text-slate-700'
                  }`}
                >
                  <span>{p.first_name} {p.last_name}</span>
                  <span className="text-[10px] uppercase font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Main Shell */}
      <div className="main-shell">
        <header className="topbar">
          <div className="mobile-logo"><Logo /></div>
          <form onSubmit={handleSearchSubmit} className="searchbox">
            <Icon name="search" />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              aria-label="Search components and projects"
              placeholder='Search parts or try "RC drone"'
            />
            <kbd>⌘ K</kbd>
          </form>
          <div className="top-actions">
            <Link href="/orders" className="icon-button" aria-label="Orders and Notifications">
              <Icon name="bell" />
              <span className="notification-dot" />
            </Link>
            <button
              onClick={() => setScanOpen(true)}
              className="button button-primary top-scan"
            >
              <Icon name="scan" />Scan component
            </button>
          </div>
        </header>

        <main>
          {children}
        </main>
      </div>

      {/* Mobile Nav */}
      <nav className="mobile-nav" aria-label="Mobile navigation">
        <Link href="/" className={pathname === '/' ? 'active' : ''}>
          <Icon name="home" />
          <span>Home</span>
        </Link>
        <Link href="/marketplace" className={pathname.startsWith('/marketplace') ? 'active' : ''}>
          <Icon name="market" />
          <span>Market</span>
        </Link>
        <button className="scan-fab" onClick={() => setScanOpen(true)} aria-label="Scan component">
          <span><Icon name="scan" /></span>
          <small>Scan</small>
        </button>
        <Link href="/projects" className={pathname.startsWith('/projects') ? 'active' : ''}>
          <Icon name="projects" />
          <span>Projects</span>
        </Link>
        <Link href="/orders" className={pathname.startsWith('/orders') ? 'active' : ''}>
          <Icon name="user" />
          <span>Orders</span>
        </Link>
      </nav>

      {/* Scan Panel Modal */}
      {scanOpen && <ScanPanel close={() => setScanOpen(false)} />}
    </div>
  );
}
