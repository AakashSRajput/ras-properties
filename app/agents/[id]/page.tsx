import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Star,
  Phone,
  Mail,
  MapPin,
  Building2,
  Calendar,
  MessageCircle,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import PropertyCard from '@/components/PropertyCard';
import { PropertyDTO } from '@/types';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface AgentDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: AgentDetailPageProps): Promise<Metadata> {
  const agent = await prisma.agent.findFirst({
    where: { OR: [{ id: params.id }, { email: params.id }] },
  });

  if (!agent) {
    return { title: 'Agent Not Found | RAS Properties' };
  }

  return {
    title: `${agent.name} - ${agent.specialization} | RAS Properties`,
    description: agent.bio || `Consult with ${agent.name}, verified real estate advisor at RAS Properties.`,
  };
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const agent = await prisma.agent.findFirst({
    where: { OR: [{ id: params.id }, { email: params.id }] },
    include: {
      properties: {
        where: { status: 'APPROVED' },
        include: {
          images: { orderBy: { order: 'asc' } },
          agent: true,
        },
      },
      reviews: {
        where: { isApproved: true },
        include: {
          user: { select: { id: true, name: true, avatar: true } },
        },
      },
    },
  });

  if (!agent) {
    notFound();
  }

  const cleanWhatsapp = (agent.whatsapp || '919871234567').replace(/[^0-9]/g, '');
  const whatsappUrl = `https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
    `Hello ${agent.name}, I am contacting you regarding your property listings on RAS Properties.`
  )}`;

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href="/agents" className="hover:text-amber-600">Agents</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold">{agent.name}</span>
        </div>

        {/* Profile Banner Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src={agent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80'}
              alt={agent.name}
              className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl object-cover border-4 border-amber-400/30 shadow-xl"
            />

            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
                  {agent.name}
                </h1>
                {agent.isVerified && (
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Verified RERA Advisor
                  </span>
                )}
              </div>

              <p className="text-sm font-semibold text-amber-600">{agent.specialization}</p>

              <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                {agent.bio || 'Dedicated to providing high-touch real estate services, transparent negotiations, and verified property investments.'}
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 pt-2 text-xs text-slate-700">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{agent.rating} Rating ({agent.reviewCount} Reviews)</span>
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Building2 className="w-4 h-4 text-slate-400" />
                  <span>{agent.properties.length} Active Listings</span>
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{agent.city}, {agent.state}</span>
                </span>
                {agent.licenseNumber && (
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-600">
                    RERA: {agent.licenseNumber}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Contact Box */}
            <div className="flex flex-col gap-2.5 w-full md:w-56 shrink-0 pt-4 md:pt-0">
              <a
                href={`tel:${agent.phone}`}
                className="w-full py-3 px-4 bg-navy-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Advisor</span>
              </a>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp Chat</span>
              </a>
            </div>
          </div>
        </div>

        {/* Properties Listed by this Agent */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display mb-6">
            Active Properties Managed by {agent.name.split(' ')[0]} ({agent.properties.length})
          </h2>

          {agent.properties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-sm">
              No active listings at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agent.properties.map((prop) => (
                <PropertyCard key={prop.id} property={prop as unknown as PropertyDTO} />
              ))}
            </div>
          )}
        </div>

        {/* Client Reviews Section */}
        {agent.reviews.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 font-display mb-6">
              Verified Client Reviews ({agent.reviews.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agent.reviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={rev.user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.user.name}`}
                        alt={rev.user.name}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{rev.user.name}</h4>
                        <span className="text-[10px] text-slate-400">{formatDate(rev.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    &quot;{rev.comment}&quot;
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
