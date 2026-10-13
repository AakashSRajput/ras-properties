'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ShieldCheck,
  Award,
  ChevronDown,
  Building,
  IndianRupee,
  BedDouble,
  Bath,
} from 'lucide-react';

interface PropertyFiltersProps {
  initialListingType?: string;
  className?: string;
}

export default function PropertyFilters({
  initialListingType,
  className = '',
}: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [city, setCity] = useState(searchParams.get('city') || '');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('type') || '');
  const [listingType, setListingType] = useState(
    initialListingType || searchParams.get('listingType') || ''
  );
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') || '');
  const [furnishedStatus, setFurnishedStatus] = useState(searchParams.get('furnished') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verified') === 'true');
  const [featuredOnly, setFeaturedOnly] = useState(searchParams.get('featured') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'newest');

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (city) params.set('city', city);
    if (locality) params.set('locality', locality);
    if (propertyType) params.set('type', propertyType);
    if (listingType) params.set('listingType', listingType);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (bathrooms) params.set('bathrooms', bathrooms);
    if (furnishedStatus) params.set('furnished', furnishedStatus);
    if (verifiedOnly) params.set('verified', 'true');
    if (featuredOnly) params.set('featured', 'true');
    if (sortBy && sortBy !== 'newest') params.set('sortBy', sortBy);

    router.push(`/properties?${params.toString()}`);
  };

  const resetFilters = () => {
    setCity('');
    setLocality('');
    setPropertyType('');
    setListingType(initialListingType || '');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setBathrooms('');
    setFurnishedStatus('');
    setVerifiedOnly(false);
    setFeaturedOnly(false);
    setSortBy('newest');
    router.push(initialListingType ? `/properties?listingType=${initialListingType}` : '/properties');
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 font-bold text-slate-900 font-display">
          <SlidersHorizontal className="w-4 h-4 text-amber-500" />
          <span>Filter Properties</span>
        </div>
        <button
          onClick={resetFilters}
          className="text-xs text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      <div className="space-y-4 text-xs">
        {/* Listing Type */}
        <div>
          <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Listing Intent
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setListingType('FOR_SALE')}
              className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                listingType === 'FOR_SALE' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => setListingType('FOR_RENT')}
              className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                listingType === 'FOR_RENT' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Rent
            </button>
            <button
              type="button"
              onClick={() => setListingType('FOR_LEASE')}
              className={`py-1.5 rounded-lg font-bold text-xs transition-all ${
                listingType === 'FOR_LEASE' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lease
            </button>
          </div>
        </div>

        {/* City & Locality */}
        <div>
          <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            City
          </label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="">All Indian Cities</option>
            <option value="Noida">Noida (Expressway, Sec 150, 137)</option>
            <option value="Greater Noida">Greater Noida & West</option>
            <option value="Ghaziabad">Ghaziabad (Indirapuram, Vaishali)</option>
            <option value="Gurgaon">Gurgaon (Golf Course, Cyber City)</option>
            <option value="Delhi">Delhi (Dwarka, Vasant Kunj)</option>
            <option value="Faridabad">Faridabad</option>
            <option value="Lucknow">Lucknow</option>
            <option value="Jaipur">Jaipur</option>
            <option value="Bangalore">Bangalore</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Property Type
          </label>
          <select
            value={propertyType}
            onChange={(e) => setPropertyType(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="">All Property Types</option>
            <option value="Apartment">Luxury Apartment</option>
            <option value="Flat">Society Flat</option>
            <option value="Villa">Independent Villa</option>
            <option value="Builder Floor">Builder Floor</option>
            <option value="Studio Apartment">Studio Apartment</option>
            <option value="Plot">Residential Plot</option>
            <option value="Farm House">Farm House</option>
            <option value="Office">Commercial Office</option>
            <option value="Shop">Retail Shop</option>
            <option value="Showroom">Commercial Showroom</option>
            <option value="Warehouse">Logistics Warehouse</option>
          </select>
        </div>

        {/* Budget Min / Max */}
        <div>
          <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Price Range (INR)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min Price (₹)"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-amber-500"
            />
            <input
              type="number"
              placeholder="Max Price (₹)"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Bedrooms (BHK)
          </label>
          <div className="grid grid-cols-5 gap-1 text-center">
            {['1', '2', '3', '4', '5'].map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBedrooms(bedrooms === b ? '' : b)}
                className={`py-2 rounded-lg font-bold text-xs border transition-all ${
                  bedrooms === b
                    ? 'bg-amber-500 text-slate-950 border-amber-500 font-black'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {b} {b === '5' ? '+' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Furnished Status */}
        <div>
          <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Furnishing
          </label>
          <select
            value={furnishedStatus}
            onChange={(e) => setFurnishedStatus(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="">Any Furnishing</option>
            <option value="Fully Furnished">Fully Furnished</option>
            <option value="Semi-Furnished">Semi-Furnished</option>
            <option value="Unfurnished">Unfurnished</option>
          </select>
        </div>

        {/* Verification & Featured Checkboxes */}
        <div className="pt-2 space-y-2 border-t border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
            />
            <span className="text-slate-700 font-medium">Verified & RERA Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(e) => setFeaturedOnly(e.target.checked)}
              className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 border-slate-300"
            />
            <span className="text-slate-700 font-medium">Featured Properties Only</span>
          </label>
        </div>

        {/* Sort By */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Sort Order
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-xs focus:outline-none focus:border-amber-500"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="views_desc">Most Viewed</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>

        {/* Submit Filter Button */}
        <button
          type="button"
          onClick={applyFilters}
          className="w-full py-3 bg-navy-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mt-4"
        >
          <Filter className="w-4 h-4 text-amber-400" />
          <span>Apply Filters</span>
        </button>
      </div>
    </div>
  );
}
