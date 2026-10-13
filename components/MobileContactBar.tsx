'use client';

import React, { useState } from 'react';
import { Phone, MessageCircle, Send } from 'lucide-react';
import EnquiryModal from './EnquiryModal';

interface MobileContactBarProps {
  propertyId?: string;
  propertyTitle?: string;
  agentPhone?: string;
  agentWhatsapp?: string;
}

export default function MobileContactBar({
  propertyId = 'RP1001',
  propertyTitle = 'RAS Properties Luxury Listing',
  agentPhone = '+919871234567',
  agentWhatsapp = '919871234567',
}: MobileContactBarProps) {
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

  const cleanPhone = agentPhone.replace(/[^0-9+]/g, '');
  const cleanWhatsapp = agentWhatsapp.replace(/[^0-9]/g, '');
  const whatsappMsg = encodeURIComponent(
    `Hello RAS Properties, I am interested in Property ID: ${propertyId} ("${propertyTitle}"). Please share more details and floor plan.`
  );
  const whatsappUrl = `https://wa.me/${cleanWhatsapp || '919871234567'}?text=${whatsappMsg}`;

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 p-2.5 shadow-2xl flex items-center justify-around gap-2">
        {/* Call Now */}
        <a
          href={`tel:${cleanPhone}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 font-semibold text-xs transition-colors border border-slate-700"
        >
          <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Call Now</span>
        </a>

        {/* WhatsApp */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-emerald-600/30"
        >
          <MessageCircle className="w-4 h-4 text-white shrink-0" />
          <span>WhatsApp</span>
        </a>

        {/* Enquire Now */}
        <button
          onClick={() => setShowEnquiryModal(true)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-lg shadow-amber-500/25"
        >
          <Send className="w-3.5 h-3.5 text-slate-950 shrink-0" />
          <span>Enquire</span>
        </button>
      </div>

      {showEnquiryModal && (
        <EnquiryModal
          isOpen={showEnquiryModal}
          onClose={() => setShowEnquiryModal(false)}
          propertyId={propertyId}
          propertyTitle={propertyTitle}
        />
      )}
    </>
  );
}
