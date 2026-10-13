'use client';

import React, { useState } from 'react';
import {
  Phone,
  MessageCircle,
  Calendar,
  Send,
  Heart,
  Share2,
  ShieldCheck,
  Award,
  Star,
  User,
} from 'lucide-react';
import { PropertyDTO } from '@/types';
import { showToast } from '@/components/ToastProvider';
import ScheduleVisitModal from '@/components/ScheduleVisitModal';
import EnquiryModal from '@/components/EnquiryModal';

interface PropertyDetailClientActionsProps {
  property: PropertyDTO;
}

export default function PropertyDetailClientActions({ property }: PropertyDetailClientActionsProps) {
  const [isFavorited, setIsFavorited] = useState(property.isFavorited || false);
  const [isFavLoading, setIsFavLoading] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const agentName = property.agent?.name || 'Rajesh Sharma';
  const agentPhoto = property.agent?.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80';
  const agentPhone = property.agent?.phone || '+91 98712 34567';
  const agentEmail = property.agent?.email || 'contact@rasproperties.in';
  const agentRating = property.agent?.rating || 4.9;
  const agentWhatsapp = property.agent?.whatsapp || '919871234567';

  const cleanPhone = agentPhone.replace(/[^0-9+]/g, '');
  const whatsappMsg = encodeURIComponent(
    `Hello RAS Properties, I am interested in Property ID: RP${property.id.slice(-6).toUpperCase()} ("${property.title}"). Please share the complete brochure and schedule a site inspection.`
  );
  const whatsappUrl = `https://wa.me/${agentWhatsapp}?text=${whatsappMsg}`;

  const handleFavoriteToggle = async () => {
    setIsFavLoading(true);
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
        showToast(data.isFavorited ? 'Property added to saved favorites!' : 'Removed from favorites', 'success');
      }
    } catch {
      showToast('Unable to update favorite status', 'error');
    } finally {
      setIsFavLoading(false);
    }
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Property link copied to clipboard!', 'success');
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        {/* Agent Info Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100">
          <img
            src={agentPhoto}
            alt={agentName}
            className="w-14 h-14 rounded-2xl object-cover border-2 border-amber-400/40 shadow-md"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="font-bold text-slate-900 text-base truncate">{agentName}</h4>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 truncate">
              {property.agent?.specialization || 'Senior Real Estate Consultant'}
            </p>
            <div className="flex items-center gap-1 text-xs text-amber-600 font-bold mt-0.5">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{agentRating} Rating</span>
              <span className="text-slate-400 font-normal">({property.agent?.reviewCount || 34} reviews)</span>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3">
          {/* Schedule Site Visit */}
          <button
            onClick={() => setShowScheduleModal(true)}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Free Site Visit</span>
          </button>

          {/* Send Online Enquiry */}
          <button
            onClick={() => setShowEnquiryModal(true)}
            className="w-full py-3 px-4 bg-navy-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4 text-amber-400" />
            <span>Send Enquiry Message</span>
          </button>

          {/* Direct WhatsApp Action */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>

          {/* Call Agent Directly */}
          <a
            href={`tel:${cleanPhone}`}
            className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-200"
          >
            <Phone className="w-4 h-4 text-slate-600" />
            <span>Call Agent: {agentPhone}</span>
          </a>
        </div>

        {/* Secondary Social & Save Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            onClick={handleFavoriteToggle}
            disabled={isFavLoading}
            className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              isFavorited
                ? 'bg-rose-50 text-rose-600 border-rose-200'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isFavorited ? 'Saved' : 'Save Property'}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Share Link</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showScheduleModal && (
        <ScheduleVisitModal
          isOpen={showScheduleModal}
          onClose={() => setShowScheduleModal(false)}
          propertyId={property.id}
          propertyTitle={property.title}
          agentId={property.agentId}
        />
      )}

      {showEnquiryModal && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          propertyId={property.id}
          propertyTitle={property.title}
        />
      )}
    </>
  );
}
