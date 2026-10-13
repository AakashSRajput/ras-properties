import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  ShieldCheck,
  Star,
  Phone,
  Mail,
  Building2,
  Award,
  ArrowRight,
  MessageCircle,
  MapPin,
  Search,
} from 'lucide-react';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Our Real Estate Advisors & Agents | RAS Properties',
  description:
    'Meet RAS Properties team of certified RERA real estate advisors and property specialists across Noida, Gurgaon, Ghaziabad, and Delhi NCR.',
};

export default async function AgentsPage({
  searchParams,
}: {
  searchParams: { city?: string; search?: string };
}) {
  const city = searchParams.city;
  const search = searchParams.search;

  const where: any = {};
  if (city) where.city = { contains: city };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { specialization: { contains: search } },
      { city: { contains: search } },
    ];
  }

  const agents = await prisma.agent.findMany({
    where,
    orderBy: { rating: 'desc' },
    include: {
      properties: {
        where: { status: 'APPROVED' },
        take: 3,
        include: { images: { take: 1 } },
      },
    },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Dedicated Property Specialists</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
            Meet Our Certified Advisors
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Every RAS advisor is RERA compliant, locally experienced, and committed to transparent property consulting.
          </p>
        </div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {agents.map((agent) => {
            const cleanWhatsapp = (agent.whatsapp || '919871234567').replace(/[^0-9]/g, '');
            const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
              `Hello ${agent.name}, I am looking for property advisory via RAS Properties.`
            )}`;

            return (
              <div
                key={agent.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-amber-400/50 shadow-sm hover:shadow-luxury transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6">
                  {/* Photo & Badge */}
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={agent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80'}
                      alt={agent.name}
                      className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/30 shadow-md"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <Link href={`/agents/${agent.id}`}>
                          <h3 className="font-bold text-slate-900 text-lg hover:text-amber-600 transition-colors truncate">
                            {agent.name}
                          </h3>
                        </Link>
                        {agent.isVerified && (
                          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-amber-600 font-semibold mt-0.5">
                        {agent.specialization}
                      </p>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{agent.city}, {agent.state}</span>
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed mb-4">
                    {agent.bio || 'Experienced real estate professional assisting buyers with verified properties across Delhi NCR.'}
                  </p>

                  {/* Stats Row */}
                  <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center text-xs mb-4">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center justify-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{agent.rating}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">({agent.reviewCount} reviews)</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{agent.experience}+ Yrs</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Experience</div>
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">{agent.activeListings}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Active Deals</div>
                    </div>
                  </div>

                  {/* RERA Number */}
                  {agent.licenseNumber && (
                    <div className="text-[11px] text-slate-500 bg-slate-100/80 px-2.5 py-1 rounded-md text-center font-mono">
                      RERA: {agent.licenseNumber}
                    </div>
                  )}
                </div>

                {/* Footer Contact Buttons */}
                <div className="p-4 bg-slate-50/80 border-t border-slate-100 grid grid-cols-3 gap-2">
                  <a
                    href={`tel:${agent.phone}`}
                    className="py-2 px-1 text-center bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-lg border border-slate-200 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-slate-600" />
                    <span>Call</span>
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-1 text-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>

                  <Link
                    href={`/agents/${agent.id}`}
                    className="py-2 px-1 text-center bg-navy-900 hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Profile</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
