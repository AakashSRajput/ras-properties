import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | RAS Properties',
  description: 'Terms and conditions for using RAS Properties real estate platform.',
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">Terms of Service</h1>
          <p className="text-xs text-slate-400 mt-1">Effective Date: October 2026</p>
        </div>

        <p>
          Welcome to <strong>RAS Properties</strong>. By accessing our platform, browsing property listings, or registering an account as a buyer, owner, or agent, you agree to comply with and be bound by the following terms.
        </p>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 pt-2">1. Property Listings & Accuracy</h2>
        <p>
          While RAS Properties performs due diligence and document verification, property owners and developers are responsible for the authenticity of the legal title, floor areas, sanctioned layouts, and pricing details submitted.
        </p>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 pt-2">2. User Accounts & Responsibilities</h2>
        <p>
          You are responsible for safeguarding your login credentials. You agree not to submit fraudulent, misleading, or copyrighted property images or text without authorization.
        </p>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 pt-2">3. Admin Approval & Listing Moderation</h2>
        <p>
          All submitted properties undergo administrative review to protect buyers against duplicate, fraudulent, or non-compliant listings. RAS Properties reserves the right to reject or suspend non-compliant listings.
        </p>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 pt-2">4. Applicable Jurisdiction</h2>
        <p>
          These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the competent courts in Gautam Buddha Nagar (Noida), Uttar Pradesh.
        </p>
      </div>
    </div>
  );
}
