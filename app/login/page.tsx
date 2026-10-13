'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Building2,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  User,
  Key,
} from 'lucide-react';
import { showToast } from '@/components/ToastProvider';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Login successful! Welcome back.', 'success');
        if (data.user?.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        router.refresh();
      } else {
        showToast(data.error || 'Invalid credentials. Please try again.', 'error');
      }
    } catch {
      showToast('Network error during login.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo Login Helper
  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    showToast(`Filled credentials for ${demoEmail}`, 'info');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Building2 className="w-6 h-6 text-navy-950 font-black" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
              RAS <span className="text-amber-500">PROPERTIES</span>
            </span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Sign in to manage your saved properties, enquiries, and listings.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address *
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@rasproperties.in"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-semibold text-slate-700 uppercase tracking-wider">
                  Password *
                </label>
                <Link
                  href="/forgot-password"
                  className="text-amber-600 hover:text-amber-700 font-medium"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Credentials Switcher */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Quick 1-Click Demo Login
            </span>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => fillCredentials('admin@rasproperties.in', 'AdminPassword@2026')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-center border border-slate-200 transition-colors"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('rajesh.sharma@rasproperties.in', 'UserPassword@2026')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-center border border-slate-200 transition-colors"
              >
                Agent
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('ramesh.kumar@gmail.com', 'UserPassword@2026')}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-center border border-slate-200 transition-colors"
              >
                User / Owner
              </button>
            </div>
          </div>

          {/* Register Link */}
          <div className="text-center text-xs text-slate-500 pt-2">
            Don&apos;t have an account yet?{' '}
            <Link href="/register" className="font-bold text-amber-600 hover:text-amber-700">
              Create Free Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
