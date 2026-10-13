import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  Award,
  Users,
  CheckCircle2,
  MapPin,
  TrendingUp,
  Target,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | RAS Properties - Your Trusted Partner in Real Estate',
  description:
    'Learn about RAS Properties, North India’s premier RERA registered real estate advisory firm serving Noida, Greater Noida, Ghaziabad, Gurgaon, and Delhi NCR.',
};

export default function AboutPage() {
  const milestones = [
    { year: '2012', title: 'Foundation in Noida', desc: 'Started operations with a focus on Noida Expressway and Sector 137 residential developments.' },
    { year: '2016', title: 'RERA Compliance Pioneer', desc: 'Among the first consultancy firms in UP to mandate 100% RERA verified developer onboarding.' },
    { year: '2020', title: 'Expanded to Gurgaon & Delhi', desc: 'Launched luxury corporate leasing and Grade-A commercial asset management wings.' },
    { year: '2026', title: '₹450+ Cr Portfolio & Digital First', desc: 'Empowering over 1,800+ families with seamless digital property discovery and instant advisory.' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-navy-950 text-white py-20 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Building2 className="w-3.5 h-3.5" />
            <span>ESTABLISHED 2012</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white">
            About <span className="text-amber-400">RAS Properties</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            Your Trusted Partner in Real Estate — Redefining property buying, selling, and commercial investments with transparency and integrity across North India.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">Our Mission</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To simplify the Indian real estate ecosystem by delivering 100% legally vetted, transparently priced, and RERA-compliant homes and commercial spaces, backed by personalized client relationships.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-amber-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Zero Misrepresentation Guarantee</span>
            </div>
          </div>

          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center font-bold">
                <Compass className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 font-display">Our Vision</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                To become India&apos;s most reliable, tech-enabled property advisory brand, empowering every family and investor to make safe, high-appreciation real estate decisions.
              </p>
            </div>
            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-sky-600">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              <span>Certified RERA Reg: UPRERAAGT20240982</span>
            </div>
          </div>
        </div>
      </section>

      {/* Company Milestones */}
      <section className="py-16 bg-slate-100 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              Our Journey of Trust & Excellence
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Over a decade of milestones building lasting value for Indian homeowners.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {milestones.map((m) => (
              <div key={m.year} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <span className="text-2xl font-black text-amber-500 font-display">{m.year}</span>
                <h3 className="font-bold text-slate-900 text-sm">{m.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership & Core Values */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
            Ready to Find Your Ideal Space?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Whether buying your first apartment in Sector 137 or investing in high-yield commercial assets, our dedicated team is here to assist you at every step.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/properties"
              className="px-6 py-3 bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>Explore Verified Properties</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Contact Advisory Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
