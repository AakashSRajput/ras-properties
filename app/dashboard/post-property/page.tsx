'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Building2,
  MapPin,
  IndianRupee,
  Home,
  CheckCircle2,
  Upload,
  Phone,
  Eye,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Plus,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { showToast } from '@/components/ToastProvider';
import { formatINR } from '@/lib/utils';

export default function PostPropertyWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    // Step 1: Basic
    title: '',
    description: '',
    propertyType: 'Apartment',
    listingType: 'FOR_SALE',

    // Step 2: Location
    address: '',
    locality: '',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '',

    // Step 3: Pricing
    price: '',
    pricePerSqFt: '',

    // Step 4: Details
    bedrooms: '3',
    bathrooms: '3',
    balconies: '2',
    area: '1450',
    areaUnit: 'Sq.Ft.',
    floor: '5',
    totalFloors: '20',
    parking: '1 Covered',
    furnishedStatus: 'Semi-Furnished',
    facing: 'North-East',

    // Step 5: Amenities
    amenities: [
      '24x7 Security & CCTV',
      '100% Power Backup',
      'High Speed Elevators',
      'Modern Gymnasium',
      'Gated Community',
    ],

    // Step 6: Media
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    ],
    newImageUrl: '',

    // Step 7: Legal & RERA
    reraNumber: '',
    contactPhone: '+91 98712 34567',
  });

  const allAvailableAmenities = [
    '24x7 Security & CCTV',
    '100% Power Backup',
    'Swimming Pool',
    'Clubhouse & Party Lawn',
    'Modern Gymnasium',
    'Children Play Area',
    'Landscaped Gardens',
    'Reserved Covered Parking',
    'High Speed Elevators',
    'Vastu Compliant Layout',
    'Piped Gas (IGL)',
    'Rainwater Harvesting',
    'Jogging Track',
    'Tennis & Badminton Court',
    'EV Charging Station',
    'Visitor Parking',
    'Gated Community',
  ];

  const toggleAmenity = (name: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(name);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((a) => a !== name)
          : [...prev.amenities, name],
      };
    });
  };

  const handleAddImage = () => {
    if (!formData.newImageUrl) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, prev.newImageUrl],
      newImageUrl: '',
    }));
    showToast('Image added to gallery', 'success');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && (!formData.title || !formData.propertyType)) {
      showToast('Please enter property title and type', 'error');
      return;
    }
    if (currentStep === 2 && (!formData.locality || !formData.city || !formData.pincode)) {
      showToast('Please enter locality, city and pincode', 'error');
      return;
    }
    if (currentStep === 3 && !formData.price) {
      showToast('Please enter total property price', 'error');
      return;
    }
    if (currentStep === 4 && !formData.area) {
      showToast('Please enter property built-up area', 'error');
      return;
    }
    setCurrentStep((prev) => Math.min(8, prev + 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
    window.scrollTo({ top: 100, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showToast('Property submitted successfully! Under admin review.', 'success');
        router.push('/dashboard/my-properties');
        router.refresh();
      } else {
        showToast(data.error || 'Failed to submit property', 'error');
      }
    } catch {
      showToast('Network error while posting property', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const stepsList = [
    'Basic Info',
    'Location',
    'Pricing',
    'Specs',
    'Amenities',
    'Media',
    'RERA & Contact',
    'Preview & Submit',
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
      {/* Wizard Header */}
      <div className="border-b border-slate-100 pb-4">
        <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
          Step {currentStep} of 8
        </span>
        <h1 className="text-2xl font-black text-slate-900 font-display">
          Post Property Listing
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Complete the 8-step wizard to list your property for free on RAS Properties.
        </p>
      </div>

      {/* Step Progress Pills */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {stepsList.map((sName, idx) => {
          const stepNum = idx + 1;
          const isDone = stepNum < currentStep;
          const isCurrent = stepNum === currentStep;
          return (
            <div
              key={sName}
              onClick={() => {
                if (stepNum < currentStep) setCurrentStep(stepNum);
              }}
              className={`p-2 rounded-xl text-center text-[10px] font-bold transition-all cursor-pointer ${
                isCurrent
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : isDone
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-50 text-slate-400 border border-slate-200'
              }`}
            >
              <span className="block font-black">{stepNum}</span>
              <span className="truncate block mt-0.5">{sName}</span>
            </div>
          );
        })}
      </div>

      {/* WIZARD FORM STEPS */}
      <div className="space-y-6 text-xs max-w-2xl">
        {/* STEP 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 font-display">1. Basic Information</h3>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Property Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. 3 BHK Luxury Park Facing Apartment with Modular Kitchen"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Property Type *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                >
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

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Listing Intent *
                </label>
                <select
                  value={formData.listingType}
                  onChange={(e) => setFormData({ ...formData, listingType: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="FOR_SALE">For Sale</option>
                  <option value="FOR_RENT">For Rent</option>
                  <option value="FOR_LEASE">For Lease</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Property Description
              </label>
              <textarea
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Highlight unique features, society maintenance, metro distance, views..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 font-display">2. Location Details</h3>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Complete Project / Building Address *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Tower B, Royal Park Heights, Sector 137"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Locality / Sector *
                </label>
                <input
                  type="text"
                  required
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  placeholder="Sector 137 (Expressway)"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  City *
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Noida">Noida</option>
                  <option value="Greater Noida">Greater Noida</option>
                  <option value="Ghaziabad">Ghaziabad</option>
                  <option value="Gurgaon">Gurgaon</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Faridabad">Faridabad</option>
                  <option value="Lucknow">Lucknow</option>
                  <option value="Jaipur">Jaipur</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="201305"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Pricing */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 font-display">3. Pricing Details</h3>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Total Price in INR (₹) *
              </label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="e.g. 8500000 (85 Lakh) or 35000 (Rent)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              />
              {formData.price && (
                <div className="text-xs font-bold text-amber-600 mt-1">
                  Formatted: {formatINR(parseFloat(formData.price), formData.listingType === 'FOR_RENT')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: Property Details */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 font-display">4. Specifications & Layout</h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Bedrooms (BHK)
                </label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="0">0 (Plot/Commercial)</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5">5+ BHK</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Bathrooms
                </label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="1">1 Bath</option>
                  <option value="2">2 Baths</option>
                  <option value="3">3 Baths</option>
                  <option value="4">4 Baths</option>
                  <option value="5">5+ Baths</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Balconies
                </label>
                <select
                  value={formData.balconies}
                  onChange={(e) => setFormData({ ...formData, balconies: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Super Built-up Area *
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    placeholder="1450"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
                  />
                  <select
                    value={formData.areaUnit}
                    onChange={(e) => setFormData({ ...formData, areaUnit: e.target.value })}
                    className="p-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-800 text-xs font-bold"
                  >
                    <option value="Sq.Ft.">Sq.Ft.</option>
                    <option value="Sq.Yards">Sq.Yards</option>
                    <option value="Gaj">Gaj</option>
                    <option value="Acres">Acres</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Furnished Status
                </label>
                <select
                  value={formData.furnishedStatus}
                  onChange={(e) => setFormData({ ...formData, furnishedStatus: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Fully Furnished">Fully Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Amenities */}
        {currentStep === 5 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 font-display">5. Select Society & Unit Amenities</h3>
            <p className="text-xs text-slate-500">Click to select amenities present in your property or society complex:</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {allAvailableAmenities.map((am) => {
                const isSelected = formData.amenities.includes(am);
                return (
                  <button
                    key={am}
                    type="button"
                    onClick={() => toggleAmenity(am)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${isSelected ? 'text-slate-950' : 'text-slate-400'}`} />
                    <span className="truncate">{am}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 6: Media / Images */}
        {currentStep === 6 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 font-display">6. Property Photos</h3>
            <p className="text-xs text-slate-500">Provide high resolution photos (URLs or uploads) to boost buyer enquiries:</p>

            <div className="flex gap-2">
              <input
                type="text"
                value={formData.newImageUrl}
                onChange={(e) => setFormData({ ...formData, newImageUrl: e.target.value })}
                placeholder="Paste image URL (Unsplash or Cloudinary)..."
                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="px-4 py-3 bg-navy-900 text-amber-400 font-bold rounded-xl flex items-center gap-1 shrink-0 text-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Image</span>
              </button>
            </div>

            {/* Image Preview Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {formData.images.map((imgUrl, idx) => (
                <div key={idx} className="relative aspect-[16/10] rounded-xl overflow-hidden border border-slate-200 group">
                  <img src={imgUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-rose-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 7: Legal & RERA */}
        {currentStep === 7 && (
          <div className="space-y-4 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 font-display">7. Legal & Contact Info</h3>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                UP / HR RERA Project ID (If Applicable)
              </label>
              <input
                type="text"
                value={formData.reraNumber}
                onChange={(e) => setFormData({ ...formData, reraNumber: e.target.value })}
                placeholder="e.g. UPRERAPRJ12345"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone Number
              </label>
              <input
                type="tel"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                placeholder="+91 98712 34567"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* STEP 8: Preview & Final Submit */}
        {currentStep === 8 && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-base font-bold text-slate-900 font-display">8. Review & Publish</h3>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                    {formData.listingType.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{formData.title}</h4>
                  <p className="text-slate-500 text-xs">{formData.locality}, {formData.city}</p>
                </div>
                <div className="text-base font-black text-slate-900 font-display">
                  {formatINR(parseFloat(formData.price || '0'), formData.listingType === 'FOR_RENT')}
                </div>
              </div>

              <div className="text-xs text-slate-600 border-t border-slate-200 pt-2 flex gap-4">
                <span>{formData.bedrooms} BHK</span>
                <span>{formData.bathrooms} Baths</span>
                <span>{formData.area} {formData.areaUnit}</span>
                <span>{formData.furnishedStatus}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                Your property will be reviewed by RAS Properties moderation team and published online.
              </span>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          ) : <div />}

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 bg-navy-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-colors"
            >
              <span>Continue Step {currentStep + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="px-8 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-xl shadow-amber-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>{submitting ? 'Submitting...' : 'Submit & Publish Listing'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
