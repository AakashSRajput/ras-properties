import React from 'react';
import { Metadata } from 'next';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'RERA & Legal Disclaimer | RAS Properties',
  description: 'Official RERA and legal disclaimer for RAS Properties.',
};

export default function DisclaimerPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-200 pb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">RERA & Legal Disclaimer</h1>
            <p className="text-xs text-slate-400 mt-1">Regulatory Transparency Notice</p>
          </div>
          <ShieldCheck className="w-8 h-8 text-amber-500" />
        </div>

        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs font-medium space-y-2">
          <p className="font-bold">UP RERA Registration ID: UPRERAAGT20240982</p>
          <p>
            RAS Properties is an authorized real estate agent registered under the Real Estate (Regulation and Development) Act, 2016.
          </p>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 pt-2">1. Real Estate Projects & Marketing</h2>
        <p>
          Information displayed on this website regarding projects, prices, floor plans, and amenities is sourced from developers, certified property owners, and public RERA filings. Buyers are advised to independently verify all approvals, builder-buyer agreements, occupancy certificates, and circle rates before entering into financial commitments.
        </p>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 pt-2">2. Financial & Investment Guidance</h2>
        <p>
          Any projections regarding capital appreciation, rental yield, or tax benefits are indicative estimates and do not constitute formal banking or legal investment guarantees.
        </p>
      </div>
    </div>
  );
}
