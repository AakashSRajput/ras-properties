'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, ShieldCheck } from 'lucide-react';
import { showToast } from './ToastProvider';

interface ScheduleVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  agentId?: string | null;
}

export default function ScheduleVisitModal({
  isOpen,
  onClose,
  propertyId,
  propertyTitle,
  agentId,
}: ScheduleVisitModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('11:00 AM');
  const [message, setMessage] = useState('I would like to schedule an in-person physical inspection of this property.');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !visitDate || !visitTime) {
      showToast('Please fill in your name, phone number, visit date, and time slot.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/visits/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          agentId,
          name,
          email,
          phone,
          visitDate,
          visitTime,
          message,
        }),
      });

      if (res.ok) {
        showToast('Site visit scheduled successfully! Our property manager will confirm via WhatsApp & SMS.', 'success');
        onClose();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to schedule visit. Please try again.', 'error');
      }
    } catch {
      showToast('Network error while scheduling visit.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h3 className="text-lg font-bold text-white font-display">Schedule a Site Visit</h3>
            <p className="text-xs text-amber-400 font-medium truncate max-w-sm mt-0.5">
              {propertyTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-2.5 text-xs text-amber-300">
            <ShieldCheck className="w-4 h-4 shrink-0 text-amber-400" />
            <span>Free guided tour with verified RERA property executive & zero broker fee.</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Full Name *
            </label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Vikram Malhotra"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Phone Number *
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98112 34567"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vikram@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Select Date *
              </label>
              <div className="relative flex items-center">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <input
                  type="date"
                  required
                  value={visitDate}
                  onChange={(e) => setVisitDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                Select Time Slot *
              </label>
              <div className="relative flex items-center">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <select
                  value={visitTime}
                  onChange={(e) => setVisitTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                >
                  <option value="10:00 AM - 11:30 AM">10:00 AM - 11:30 AM</option>
                  <option value="11:30 AM - 01:00 PM">11:30 AM - 01:00 PM</option>
                  <option value="02:00 PM - 03:30 PM">02:00 PM - 03:30 PM</option>
                  <option value="03:30 PM - 05:00 PM">03:30 PM - 05:00 PM</option>
                  <option value="05:00 PM - 06:30 PM">05:00 PM - 06:30 PM</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
              Special Note / Request
            </label>
            <textarea
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4 text-slate-950 font-bold" />
            <span>{submitting ? 'Confirming...' : 'Confirm Site Visit'}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
