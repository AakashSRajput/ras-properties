'use client';

import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  Building2,
  ShieldCheck,
  MessageCircle,
} from 'lucide-react';
import { showToast } from '@/components/ToastProvider';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Buying / Investment Inquiry');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in your name, email, and message.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });

      if (res.ok) {
        showToast('Message sent successfully! Our executive will contact you shortly.', 'success');
        setName('');
        setEmail('');
        setPhone('');
        setMessage('');
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to send message. Please try again.', 'error');
      }
    } catch {
      showToast('Network error while sending message.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <Mail className="w-4 h-4 text-amber-500" />
            <span>Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
            Contact RAS Properties
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Have questions about buying, selling, or leasing properties in Delhi NCR? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Info Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-slate-900 font-display">Corporate Headquarters</h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Noida Office</h4>
                    <p className="text-slate-600 mt-0.5 text-xs leading-relaxed">
                      Corporate Tower A, Advant Navis / Sector 137, Noida Expressway, Gautam Buddha Nagar, UP - 201305
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Direct Helplines</h4>
                    <p className="text-slate-600 mt-0.5 text-xs">
                      +91 98712 34567 / +91 98101 23456
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Official Email</h4>
                    <p className="text-slate-600 mt-0.5 text-xs">
                      contact@rasproperties.in / advisory@rasproperties.in
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">Consultation Hours</h4>
                    <p className="text-slate-600 mt-0.5 text-xs">
                      Monday to Sunday: 09:30 AM - 07:30 PM (IST)
                    </p>
                  </div>
                </div>
              </div>

              {/* RERA Badge */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-3 text-xs text-slate-600">
                <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                <span>UP RERA Certificate: <strong>UPRERAAGT20240982</strong></span>
              </div>
            </div>

            {/* Quick WhatsApp CTA Card */}
            <div className="bg-navy-950 text-white rounded-3xl p-6 border border-navy-800 shadow-xl flex items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-sm text-white">Instant WhatsApp Connect</h4>
                <p className="text-xs text-slate-400 mt-0.5">Receive immediate floor plans and brochures.</p>
              </div>
              <a
                href="https://wa.me/919871234567?text=Hello%20RAS%20Properties,%20I%20would%20like%20to%20inquire%20about%20property%20consulting."
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/30 shrink-0 flex items-center gap-1.5 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Form Column (7 cols) */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900 font-display mb-2">Send Us a Direct Message</h3>
              <p className="text-xs text-slate-500 mb-6">
                Fill in your requirements and our certified property specialist will reach out within 2 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Deepika Patel"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="deepika@gmail.com"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                      Phone / Mobile
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98222 00002"
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Inquiry Topic
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="Buying / Residential Apartment">Buying Residential Flat / Villa</option>
                    <option value="Commercial Office / Retail Investment">Commercial Office / Retail Space</option>
                    <option value="Renting / Leasing Property">Renting / Leasing</option>
                    <option value="Selling / Listing My Property">Selling / Listing My Property</option>
                    <option value="Home Loan & Legal Due Diligence">Home Loan & Legal Due Diligence</option>
                    <option value="General Inquiry">General Query</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Your Message / Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your preferred location, budget, or timeline..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4 text-slate-950" />
                  <span>{submitting ? 'Sending Message...' : 'Send Inquiry Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
