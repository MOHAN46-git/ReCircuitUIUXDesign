'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getBrowserSupabaseClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { Cpu, Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { Profile } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [hasSupabase, setHasSupabase] = useState(false);
  const [demoProfiles, setDemoProfiles] = useState<Profile[]>([]);

  useEffect(() => {
    setHasSupabase(isSupabaseConfigured());
    fetch('/api/profile')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setDemoProfiles(d.availableUsers || []);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (hasSupabase) {
        const client = getBrowserSupabaseClient();
        if (!client) throw new Error('Supabase client unavailable');

        const { data, error } = await client.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw new Error(error.message);
        }

        setSuccessMsg('Signed in successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
          router.refresh();
        }, 1000);
      } else {
        // Fallback demo login simulation
        const matched = demoProfiles.find(p => p.email?.toLowerCase() === email.toLowerCase());
        if (matched) {
          await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: matched.id }),
          });
          setSuccessMsg(`Welcome back, ${matched.first_name}! Redirecting...`);
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 800);
        } else {
          setErrorMsg('No demo account found with this email. Select a quick persona below or create a new account.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign in. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (profileId: string) => {
    try {
      setLoading(true);
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: profileId }),
      });
      router.push('/');
      router.refresh();
    } catch {
      setErrorMsg('Failed to switch persona');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 group mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <Cpu className="w-6 h-6 text-slate-950 font-bold" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight text-white flex items-center gap-1.5">
              ReCircuit
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest font-mono">
                Auth
              </span>
            </span>
            <p className="text-[11px] text-slate-400 font-mono">Circular Electronics Sign-In</p>
          </div>
        </Link>

        <h2 className="text-center text-2xl font-extrabold text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400">
          Or{' '}
          <Link href="/signup" className="font-medium text-emerald-400 hover:text-emerald-300">
            register as a student buyer, lab coordinator, or maker seller
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#0f172a] py-8 px-6 shadow-2xl rounded-2xl border border-slate-800 sm:px-10">
          {/* Mode indicator pill */}
          <div className="mb-6 flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Auth Mode:
            </span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
              hasSupabase
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
            }`}>
              {hasSupabase ? 'Supabase Live' : 'Demo Local Storage'}
            </span>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-300 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-medium text-slate-300">Email Address</label>
              <div className="mt-1.5 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="vikram.student@saveetha.ac.in"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">Password</label>
              <div className="mt-1.5 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-slate-950 bg-emerald-500 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 transition-colors"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Personas */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Fast Demo Switcher
            </p>
            <div className="space-y-2">
              {demoProfiles.map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleQuickDemoLogin(p.id)}
                  disabled={loading}
                  className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/80 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                      {p.first_name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {p.first_name} {p.last_name}
                      </p>
                      <p className="text-[10px] text-slate-400">{p.organization}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono capitalize px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                    {p.role}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
