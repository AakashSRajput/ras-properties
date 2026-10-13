import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | RAS Properties',
  description: 'Privacy Policy and data protection terms for RAS Properties users, buyers, and owners.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-6 text-slate-700 text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-slate-200 pb-4">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">Privacy Policy</h1>
          <p className="text-xs text-slate-400 mt-1">Last Updated: October 2026</p>
        </div>

        <p>
          At <strong>RAS Properties</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), your personal privacy is paramount. This Privacy Policy outlines how we collect, use, and protect your information when you visit our website, submit property enquiries, schedule site visits, or post properties.
        </p>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 pt-2">1. Information We Collect</h2>
        <p>
          We collect personal information that you provide voluntarily, including your full name, email address, contact phone number, property location preferences, budget parameters, and property submission details.
        </p>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 pt-2">2. How We Use Your Information</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>To facilitate seamless communication between property buyers, sellers, and certified RERA real estate advisors.</li>
          <li>To confirm and coordinate in-person property site inspections.</li>
          <li>To send transactional updates regarding property verification status, enquiry responses, and account security.</li>
          <li>To comply with statutory legal mandates under UP-RERA and applicable Indian information technology regulations.</li>
        </ul>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 pt-2">3. Zero Spam & Data Confidentiality</h2>
        <p>
          We do not sell, rent, or trade your personal contact details to third-party telemarketers. All contact data is shared strictly with authorized property advisors managing your specific inquiry.
        </p>

        <h2 className="text-base sm:text-lg font-bold text-slate-900 pt-2">4. Contact Our Data Protection Officer</h2>
        <p>
          For any privacy questions or requests to modify your stored account data, please contact: <strong>privacy@rasproperties.in</strong>.
        </p>
      </div>
    </div>
  );
}
