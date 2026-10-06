'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Cpu,
  Layers,
  ShoppingBag,
  Recycle,
  BarChart3,
  Bot,
  PlusCircle,
  UserCheck,
  ChevronDown,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { Profile } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const [activeUser, setActiveUser] = useState<Profile | null>(null);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setActiveUser(data.activeUser);
          setProfiles(data.availableUsers);
        }
      })
      .catch(() => {});
  }, []);

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
        setShowUserMenu(false);
        // Reload current page to refresh matched inventories and context
        window.location.reload();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { name: 'Dashboard', href: '/', icon: Cpu },
    { name: 'Projects', href: '/projects', icon: Layers },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingBag },
    { name: 'E-Waste', href: '/ewaste', icon: Recycle },
    { name: 'Impact', href: '/impact', icon: BarChart3 },
    { name: 'AI Assistant', href: '/assistant', icon: Bot },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0f172a]/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                ReCircuit
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest font-mono">
                  Circular
                </span>
              </span>
              <p className="text-[10px] text-slate-400 -mt-1 font-mono">Electronics Reuse & BOM Match</p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {/* Primary Action Button: Scan / Add Component */}
            <Link
              href="/seller/listings/new"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20 transition-all hover:shadow-emerald-500/30"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Scan / List</span>
            </Link>

            {/* Demo Persona Switcher */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:border-slate-600 text-xs text-slate-200 transition-colors"
                title="Switch demo persona for judging / testing"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-400 text-[10px]">
                  {activeUser?.first_name?.[0] || 'U'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="font-medium text-slate-200 leading-none">
                    {activeUser?.first_name} {activeUser?.last_name}
                  </p>
                  <p className="text-[10px] text-emerald-400 capitalize">{activeUser?.role} Demo</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Persona Switcher Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-800">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Demo Personas
                    </p>
                    <p className="text-[10px] text-slate-500">
                      Switch accounts to test buyer vs seller features
                    </p>
                  </div>
                  <div className="py-1">
                    {profiles.map(p => (
                      <button
                        key={p.id}
                        onClick={() => switchUser(p.id)}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 transition-colors ${
                          activeUser?.id === p.id ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-200">
                            {p.first_name[0]}
                          </span>
                          <div>
                            <p className="font-semibold">{p.first_name} {p.last_name}</p>
                            <p className="text-[10px] text-slate-400">{p.organization}</p>
                          </div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 capitalize border border-slate-700">
                          {p.role}
                        </span>
                      </button>
                    ))}
                  </div>
                  <div className="border-t border-slate-800 mt-1 pt-1.5 px-2">
                    <Link
                      href="/login"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-2.5 py-1.5 text-xs text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/60 rounded-lg transition-colors font-medium text-center"
                    >
                      Sign In / Switch to Live Auth →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation tray */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0f172a] px-4 pt-2 pb-4 space-y-1">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
