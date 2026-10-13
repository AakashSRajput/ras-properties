'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  ShieldCheck,
  Award,
  Share2,
  Phone,
  MessageCircle,
  Eye,
} from 'lucide-react';
import { PropertyDTO } from '@/types';
import { formatINR } from '@/lib/utils';
import { showToast } from './ToastProvider';

interface PropertyCardProps {
  property: PropertyDTO;
  onFavoriteToggle?: (propertyId: string, isFav: boolean) => void;
}

export default function PropertyCard({ property, onFavoriteToggle }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(property.isFavorited || false);
  const [isLoadingFav, setIsLoadingFav] = useState(false);

  const mainImage =
    property.images && property.images.length > 0
      ? property.images[0].url
      : 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  const isRent = property.listingType === 'FOR_RENT' || property.listingType === 'FOR_LEASE';

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoadingFav(true);
    try {
      const res = await fetch('/api/favorites/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ propertyId: property.id }),
      });

      if (res.status === 401) {
        showToast('Please login to save properties to your favorites', 'info');
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setIsFavorited(data.isFavorited);
        if (onFavoriteToggle) {
          onFavoriteToggle(property.id, data.isFavorited);
        }
        showToast(
          data.isFavorited ? 'Property saved to your favorites!' : 'Removed from favorites',
          'success'
        );
      }
    } catch {
      showToast('Unable to update favorites. Please try again.', 'error');
    } finally {
      setIsLoadingFav(false);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/properties/${property.slug}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url);
        showToast('Property link copied to clipboard!', 'success');
      }
    }
  };

  const agentPhone = property.agent?.phone || '+919871234567';
  const whatsappNumber = property.agent?.whatsapp || '919871234567';
  const whatsappMsg = encodeURIComponent(
    `Hello RAS Properties, I am interested in Property ID: ${property.id.slice(-6).toUpperCase()} ("${property.title}"). Please share details.`
  );
  const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${whatsappMsg}`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-amber-400/50 shadow-sm hover:shadow-luxury-hover transition-all duration-300 flex flex-col h-full">
      {/* Media Container */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <Link href={`/properties/${property.slug}`} className="block w-full h-full">
          <img
            src={mainImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
            loading="lazy"
          />
        </Link>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {property.featured && (
            <span className="bg-amber-500 text-slate-950 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              FEATURED
            </span>
          )}

          {property.verificationStatus === 'RERA_APPROVED' && (
            <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              RERA APPROVED
            </span>
          )}

          {property.verificationStatus === 'VERIFIED' && (
            <span className="bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-md flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              VERIFIED
            </span>
          )}
        </div>

        {/* Top Right Action Icons (Favorite & Share) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            onClick={handleShareClick}
            aria-label="Share property link"
            className="w-8 h-8 rounded-full bg-slate-900/60 hover:bg-slate-900 backdrop-blur-md text-white flex items-center justify-center transition-all hover:scale-110"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleFavoriteClick}
            disabled={isLoadingFav}
            aria-label="Save to favorites"
            className={`w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 ${
              isFavorited
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                : 'bg-slate-900/60 hover:bg-slate-900 text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Listing Type Tag & Views Bottom Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white z-10 text-xs">
          <span className="bg-slate-900/80 backdrop-blur-md text-amber-300 font-semibold px-2.5 py-0.5 rounded border border-white/10 uppercase tracking-wider text-[10px]">
            {property.listingType.replace('_', ' ')}
          </span>
          <span className="flex items-center gap-1 text-slate-300 text-[11px] bg-slate-950/60 px-2 py-0.5 rounded-full backdrop-blur-sm">
            <Eye className="w-3 h-3 text-slate-400" />
            {property.views || 0}
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          {/* Price & Price/Sq.Ft */}
          <div className="flex items-baseline justify-between gap-2 mb-2">
            <div className="text-xl sm:text-2xl font-black text-slate-900 font-display">
              {formatINR(property.price, isRent)}
            </div>
            {property.pricePerSqFt ? (
              <span className="text-xs text-slate-500 font-medium">
                ₹{property.pricePerSqFt.toLocaleString('en-IN')}/{property.areaUnit}
              </span>
            ) : null}
          </div>

          {/* Property Title */}
          <Link href={`/properties/${property.slug}`} className="block group-hover:text-amber-600 transition-colors">
            <h3 className="font-bold text-slate-800 text-base leading-snug line-clamp-1 mb-1.5">
              {property.title}
            </h3>
          </Link>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-slate-500 text-xs mb-3">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">
              {property.locality}, {property.city}
            </span>
          </div>

          {/* Key Specs Pills */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-xs mb-4">
            {property.bedrooms !== null && property.bedrooms !== undefined && property.bedrooms > 0 ? (
              <div className="flex items-center gap-1.5 font-medium">
                <BedDouble className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{property.bedrooms} BHK</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-slate-400 font-bold">•</span>
                <span className="truncate">{property.propertyType}</span>
              </div>
            )}

            <div className="flex items-center gap-1.5 font-medium">
              <Bath className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{property.bathrooms || 1} Baths</span>
            </div>

            <div className="flex items-center gap-1.5 font-medium">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {property.area} {property.areaUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Actions (Agent / WhatsApp / View Details) */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          {/* WhatsApp Direct */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 font-semibold text-xs py-1.5 px-2.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>

          {/* Call Agent */}
          <a
            href={`tel:${agentPhone}`}
            className="flex items-center gap-1.5 text-slate-700 hover:text-slate-900 font-semibold text-xs py-1.5 px-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call</span>
          </a>

          {/* View Details */}
          <Link
            href={`/properties/${property.slug}`}
            className="flex-1 text-center bg-navy-900 hover:bg-slate-800 text-white font-semibold text-xs py-2 px-3 rounded-lg shadow-sm transition-all"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
