'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  MapPin,
  Home,
  IndianRupee,
  BedDouble,
  Building,
  ArrowRight,
  SlidersHorizontal,
} from 'lucide-react';

interface HeroSearchProps {
  defaultTab?: 'BUY' | 'RENT' | 'COMMERCIAL';
  className?: string;
}

export default function HeroSearch({ defaultTab = 'BUY', className = '' }: HeroSearchProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'BUY' | 'RENT' | 'COMMERCIAL'>(defaultTab);
  const [city, setCity] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [budget, setBudget] = useState('');
  const [bedrooms, setBedrooms] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams();
    if (activeTab === 'BUY') {
      params.set('listingType', 'FOR_SALE');
    } else if (activeTab === 'RENT') {
      params.set('listingType', 'FOR_RENT');
    } else if (activeTab === 'COMMERCIAL') {
      params.set('commercialOnly', 'true');
    }

    if (city) params.set('city', city);
    if (propertyType) params.set('type', propertyType);
    if (bedrooms) params.set('bedrooms', bedrooms);

    if (budget) {
      const [min, max] = budget.split('-');
      if (min) params.set('minPrice', min);
      if (max) params.set('maxPrice', max);
    }

    router.push(`/search?${params.toString()}`);
  };

  const popularLocations = [
    { label: 'Noida Sector 137', city: 'Noida', locality: 'Sector 137' },
    { label: 'Noida Sector 150', city: 'Noida', locality: 'Sector 150' },
    { label: 'Greater Noida West', city: 'Greater Noida', locality: 'Greater Noida West' },
    { label: 'Indirapuram Ghaziabad', city: 'Ghaziabad', locality: 'Indirapuram' },
    { label: 'Gurgaon Golf Course Rd', city: 'Gurgaon', locality: 'Golf Course Road' },
    { label: 'Delhi Dwarka', city: 'Delhi', locality: 'Dwarka' },
  ];

  const handleQuickLocation = (loc: { city: string; locality: string }) => {
    router.push(`/search?city=${encodeURIComponent(loc.city)}&locality=${encodeURIComponent(loc.locality)}`);
  };

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      {/* Search Container */}
      <div className="bg-slate-900/95 backdrop-blur-xl p-3 sm:p-5 rounded-3xl border border-slate-800 shadow-2xl shadow-navy-950/60">
        {/* Tabs */}
        <div className="flex items-center gap-1 sm:gap-2 mb-4 p-1 bg-slate-950/80 rounded-2xl w-fit border border-slate-800">
          <button
            type="button"
            onClick={() => setActiveTab('BUY')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
              activeTab === 'BUY'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            BUY
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('RENT')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
              activeTab === 'RENT'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            RENT
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('COMMERCIAL')}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold tracking-wide transition-all ${
              activeTab === 'COMMERCIAL'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            COMMERCIAL
          </button>
        </div>

        {/* Search Inputs Grid */}
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* 1. Location / City */}
            <div className="relative">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                Location / City
              </label>
              <div className="relative flex items-center">
                <MapPin className="absolute left-3.5 w-4 h-4 text-amber-400 pointer-events-none" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900 text-slate-300">All Indian Cities</option>
                  <option value="Noida" className="bg-slate-900 text-white">Noida (Expressway, Sec 150, 137)</option>
                  <option value="Greater Noida" className="bg-slate-900 text-white">Greater Noida & West (Noida Ext.)</option>
                  <option value="Ghaziabad" className="bg-slate-900 text-white">Ghaziabad (Indirapuram, Vaishali)</option>
                  <option value="Gurgaon" className="bg-slate-900 text-white">Gurgaon (Golf Course Rd, Cyber City)</option>
                  <option value="Delhi" className="bg-slate-900 text-white">Delhi (Dwarka, Vasant Kunj)</option>
                  <option value="Faridabad" className="bg-slate-900 text-white">Faridabad</option>
                  <option value="Lucknow" className="bg-slate-900 text-white">Lucknow (Gomti Nagar)</option>
                  <option value="Jaipur" className="bg-slate-900 text-white">Jaipur</option>
                  <option value="Bangalore" className="bg-slate-900 text-white">Bangalore</option>
                </select>
              </div>
            </div>

            {/* 2. Property Type */}
            <div className="relative">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                Property Type
              </label>
              <div className="relative flex items-center">
                <Building className="absolute left-3.5 w-4 h-4 text-amber-400 pointer-events-none" />
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900 text-slate-300">All Property Types</option>
                  {activeTab !== 'COMMERCIAL' ? (
                    <>
                      <option value="Apartment" className="bg-slate-900 text-white">Luxury Apartment</option>
                      <option value="Flat" className="bg-slate-900 text-white">Society Flat</option>
                      <option value="Villa" className="bg-slate-900 text-white">Independent Villa</option>
                      <option value="Builder Floor" className="bg-slate-900 text-white">Builder Floor</option>
                      <option value="Studio Apartment" className="bg-slate-900 text-white">Studio Apartment</option>
                      <option value="Plot" className="bg-slate-900 text-white">Residential Plot</option>
                      <option value="Farm House" className="bg-slate-900 text-white">Luxury Farm House</option>
                    </>
                  ) : (
                    <>
                      <option value="Office" className="bg-slate-900 text-white">Grade-A IT Office</option>
                      <option value="Shop" className="bg-slate-900 text-white">Retail Shop / High-Street</option>
                      <option value="Showroom" className="bg-slate-900 text-white">Commercial Showroom</option>
                      <option value="Warehouse" className="bg-slate-900 text-white">Logistics Warehouse</option>
                      <option value="Commercial Building" className="bg-slate-900 text-white">Commercial Tower</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* 3. Budget Range */}
            <div className="relative">
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                Budget (INR)
              </label>
              <div className="relative flex items-center">
                <IndianRupee className="absolute left-3.5 w-4 h-4 text-amber-400 pointer-events-none" />
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                >
                  <option value="" className="bg-slate-900 text-slate-300">Any Budget</option>
                  {activeTab === 'BUY' ? (
                    <>
                      <option value="0-5000000" className="bg-slate-900 text-white">Under ₹50 Lakh</option>
                      <option value="5000000-10000000" className="bg-slate-900 text-white">₹50 Lakh - ₹1 Crore</option>
                      <option value="10000000-20000000" className="bg-slate-900 text-white">₹1 Crore - ₹2 Crore</option>
                      <option value="20000000-50000000" className="bg-slate-900 text-white">₹2 Crore - ₹5 Crore</option>
                      <option value="50000000-100000000" className="bg-slate-900 text-white">₹5 Crore - ₹10 Crore</option>
                      <option value="100000000-999999999" className="bg-slate-900 text-white">₹10 Crore+</option>
                    </>
                  ) : (
                    <>
                      <option value="0-20000" className="bg-slate-900 text-white">Under ₹20,000 / mo</option>
                      <option value="20000-40000" className="bg-slate-900 text-white">₹20,000 - ₹40,000 / mo</option>
                      <option value="40000-75000" className="bg-slate-900 text-white">₹40,000 - ₹75,000 / mo</option>
                      <option value="75000-150000" className="bg-slate-900 text-white">₹75,000 - ₹1.5 Lakh / mo</option>
                      <option value="150000-99999999" className="bg-slate-900 text-white">₹1.5 Lakh+ / mo</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* 4. Bedrooms / Search Action Button */}
            <div className="relative flex flex-col justify-end">
              {activeTab !== 'COMMERCIAL' ? (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 ml-1">
                    Bedrooms (BHK)
                  </label>
                  <div className="relative flex items-center">
                    <BedDouble className="absolute left-3.5 w-4 h-4 text-amber-400 pointer-events-none" />
                    <select
                      value={bedrooms}
                      onChange={(e) => setBedrooms(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/90 border border-slate-700/80 rounded-xl text-white text-sm focus:outline-none focus:border-amber-400 appearance-none cursor-pointer"
                    >
                      <option value="" className="bg-slate-900 text-slate-300">Any BHK</option>
                      <option value="1" className="bg-slate-900 text-white">1 BHK</option>
                      <option value="2" className="bg-slate-900 text-white">2 BHK</option>
                      <option value="3" className="bg-slate-900 text-white">3 BHK</option>
                      <option value="4" className="bg-slate-900 text-white">4 BHK</option>
                      <option value="5" className="bg-slate-900 text-white">5+ BHK</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-end">
                  <div className="text-xs text-slate-400 bg-slate-800/60 px-3 py-3 rounded-xl border border-slate-700/60 w-full text-center">
                    Verified RERA Commercials
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search Button & Advanced Search Link */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-xs text-slate-400 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <span className="font-semibold text-slate-300 shrink-0">Popular:</span>
              {popularLocations.map((loc) => (
                <button
                  key={loc.label}
                  type="button"
                  onClick={() => handleQuickLocation(loc)}
                  className="bg-slate-800/80 hover:bg-slate-700 hover:text-amber-400 text-slate-300 px-2.5 py-1 rounded-lg text-xs shrink-0 transition-colors border border-slate-700/60"
                >
                  {loc.label}
                </button>
              ))}
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
            >
              <Search className="w-4 h-4 text-slate-950 font-bold" />
              <span>Search Properties</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
