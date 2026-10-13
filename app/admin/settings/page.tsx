import React from 'react';
import { Metadata } from 'next';
import { Settings, Save, ShieldCheck, Building2, Phone, Mail, MapPin } from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Website Settings | Admin Control Center',
};

export default async function AdminSettingsPage() {
  await requireAdmin();

  const settings = await prisma.websiteSetting.findMany();
  const settingsMap = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="border-b border-slate-700 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          <span>Website & Regulatory Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage brand details, official contact numbers, RERA certificate IDs, and head office address.
        </p>
      </div>

      <div className="space-y-4 max-w-2xl text-xs">
        <div>
          <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Website Brand Name
          </label>
          <input
            type="text"
            defaultValue={settingsMap['site_name'] || 'RAS Properties'}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Official Tagline
          </label>
          <input
            type="text"
            defaultValue={settingsMap['tagline'] || 'Your Trusted Partner in Real Estate'}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Primary Support Helpline
            </label>
            <input
              type="text"
              defaultValue={settingsMap['phone'] || '+91 98712 34567'}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Official WhatsApp Number
            </label>
            <input
              type="text"
              defaultValue={settingsMap['whatsapp'] || '919871234567'}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Official Support Email
            </label>
            <input
              type="email"
              defaultValue={settingsMap['email'] || 'contact@rasproperties.in'}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">
              UP RERA Registration ID
            </label>
            <input
              type="text"
              defaultValue={settingsMap['rera_id'] || 'UPRERAAGT20240982'}
              className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Head Office Address
          </label>
          <textarea
            rows={3}
            defaultValue={settingsMap['address'] || 'Corporate Tower A, Advant Navis / Sector 137, Noida Expressway, UP 201305'}
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-400"
          />
        </div>

        <button
          type="button"
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 mt-4"
        >
          <Save className="w-4 h-4" />
          <span>Save Settings</span>
        </button>
      </div>
    </div>
  );
}
