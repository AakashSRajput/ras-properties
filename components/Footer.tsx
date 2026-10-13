'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Award,
  ArrowRight,
  Heart,
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-800 pt-16 pb-24 md:pb-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Building2 className="w-6 h-6 text-navy-950 font-black" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-1">
                  RAS <span className="text-amber-400">PROPERTIES</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium -mt-1">
                  Your Trusted Partner in Real Estate
                </span>
              </div>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed pr-6">
              RAS Properties is North India&apos;s leading RERA-registered real estate consultancy, offering end-to-end verified luxury residential apartments, premium villas, commercial spaces, and high-yield investments across Noida, Greater Noida, Ghaziabad, Gurgaon, and Delhi NCR.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-amber-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>RERA: UPRERAAGT20240982</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 text-xs font-semibold">
                <Award className="w-4 h-4 text-emerald-400" />
                <span>100% Verified Listings</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 font-display">Quick Links</h4>
            <ul className="space-y-2.5">
              <li>
                <Link href="/buy" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400/60" /> Buy Property
                </Link>
              </li>
              <li>
                <Link href="/rent" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400/60" /> Rent Property
                </Link>
              </li>
              <li>
                <Link href="/commercial" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400/60" /> Commercial Office & Retail
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400/60" /> Featured Listings
                </Link>
              </li>
              <li>
                <Link href="/agents" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400/60" /> Expert Agents
                </Link>
              </li>
              <li>
                <Link href="/dashboard/post-property" className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" /> Post Free Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Localities */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 font-display">Popular Hubs</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/search?city=Noida&locality=Sector+137" className="hover:text-white transition-colors">
                  Flats in Noida Sector 137
                </Link>
              </li>
              <li>
                <Link href="/search?city=Noida&locality=Sector+150" className="hover:text-white transition-colors">
                  Luxury Homes in Sector 150
                </Link>
              </li>
              <li>
                <Link href="/search?city=Greater+Noida" className="hover:text-white transition-colors">
                  Greater Noida West Apartments
                </Link>
              </li>
              <li>
                <Link href="/search?city=Ghaziabad&locality=Indirapuram" className="hover:text-white transition-colors">
                  Builder Floors in Indirapuram
                </Link>
              </li>
              <li>
                <Link href="/search?city=Gurgaon&locality=Golf+Course+Road" className="hover:text-white transition-colors">
                  Condos on Golf Course Road
                </Link>
              </li>
              <li>
                <Link href="/search?city=Delhi&locality=Dwarka" className="hover:text-white transition-colors">
                  Society Flats in Dwarka
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Corporate Office */}
          <div>
            <h4 className="text-white font-semibold text-base mb-4 font-display">Head Office</h4>
            <div className="space-y-3 text-xs">
              <p className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>Corporate Tower A, Advant Navis / Sector 137, Noida Expressway, Uttar Pradesh - 201305</span>
              </p>
              <p className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="tel:+919871234567" className="hover:text-white transition-colors">
                  +91 98712 34567 / +91 98101 23456
                </a>
              </p>
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:contact@rasproperties.in" className="hover:text-white transition-colors">
                  contact@rasproperties.in
                </a>
              </p>
              <div className="pt-2">
                <span className="text-[11px] text-slate-500 block">Working Hours:</span>
                <span className="text-slate-300 font-medium">Mon - Sun: 09:30 AM - 07:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Legal & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <p className="text-slate-500">
            © {new Date().getFullYear()} RAS Properties. All rights reserved. Designed for Indian Real Estate Excellence.
          </p>
          <div className="flex items-center gap-6 text-slate-400">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">
              RERA Disclaimer
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Support
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
