'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Building2, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { showToast } from '@/components/ToastProvider';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    // Simulate/trigger password recovery flow
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      showToast('Password reset instructions sent to your email!', 'success');
    }, 800);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-6">
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
            Reset Password
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Enter your registered email address and we&apos;ll send recovery instructions.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Check Your Inbox</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We have sent password recovery instructions to <strong>{email}</strong>.
              </p>
              <Link
                href="/login"
                className="inline-block px-6 py-2.5 bg-navy-900 text-white rounded-xl text-xs font-bold"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Registered Email Address *
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <span>{loading ? 'Sending...' : 'Send Reset Link'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
            <Link href="/login" className="font-bold text-slate-700 hover:text-amber-600 inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
