import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Heart,
  MessageSquare,
  Building2,
  Clock,
  PlusCircle,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { formatINR, formatDate } from '@/lib/utils';
import PropertyCard from '@/components/PropertyCard';
import { PropertyDTO } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard Overview | RAS Properties',
};

export default async function DashboardOverviewPage() {
  const session = await requireAuth();

  const [
    savedCount,
    enquiriesCount,
    myPropertiesCount,
    pendingPropertiesCount,
    recentEnquiries,
    recentVisits,
    recentSaved,
  ] = await Promise.all([
    prisma.favorite.count({ where: { userId: session.id } }),
    prisma.enquiry.count({ where: { userId: session.id } }),
    prisma.property.count({ where: { ownerId: session.id } }),
    prisma.property.count({ where: { ownerId: session.id, status: 'PENDING_APPROVAL' } }),
    prisma.enquiry.findMany({
      where: { userId: session.id },
      take: 4,
      orderBy: { createdAt: 'desc' },
      include: { property: { select: { title: true, slug: true, price: true, locality: true, city: true } } },
    }),
    prisma.visitRequest.findMany({
      where: { userId: session.id },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { property: { select: { title: true, slug: true, address: true, city: true } } },
    }),
    prisma.favorite.findMany({
      where: { userId: session.id },
      take: 2,
      orderBy: { createdAt: 'desc' },
      include: {
        property: {
          include: { images: { take: 1 }, agent: true },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-navy-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Account Dashboard</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Namaste, {session.name.split(' ')[0]}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Track your saved homes, active inquiries, scheduled visits, and listed properties in one place.
          </p>
        </div>

        <Link
          href="/dashboard/post-property"
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Property</span>
        </Link>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link
          href="/dashboard/saved"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-rose-300 shadow-sm transition-all flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold mb-2">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-display">{savedCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Saved Properties</div>
          </div>
        </Link>

        <Link
          href="/dashboard/enquiries"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-amber-300 shadow-sm transition-all flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold mb-2">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-display">{enquiriesCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Active Enquiries</div>
          </div>
        </Link>

        <Link
          href="/dashboard/my-properties"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-sky-300 shadow-sm transition-all flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center font-bold mb-2">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-display">{myPropertiesCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">My Listings</div>
          </div>
        </Link>

        <Link
          href="/dashboard/my-properties"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-purple-300 shadow-sm transition-all flex flex-col justify-between"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold mb-2">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-display">{pendingPropertiesCount}</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Under Review</div>
          </div>
        </Link>
      </div>

      {/* 2-Column Section: Recent Enquiries & Scheduled Visits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Enquiries */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-amber-500" />
              <span>Recent Enquiries</span>
            </h3>
            <Link href="/dashboard/enquiries" className="text-xs text-amber-600 hover:text-amber-700 font-bold">
              View All
            </Link>
          </div>

          {recentEnquiries.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No enquiries submitted yet. Browse properties and send inquiries!
            </p>
          ) : (
            <div className="space-y-3">
              {recentEnquiries.map((enq) => (
                <div key={enq.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 line-clamp-1">
                      {enq.property?.title || 'General Enquiry'}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-500/15 text-amber-600 font-bold text-[10px] rounded">
                      {enq.status}
                    </span>
                  </div>
                  <p className="text-slate-500 line-clamp-1 italic">&quot;{enq.message}&quot;</p>
                  <div className="text-[10px] text-slate-400">{formatDate(enq.createdAt)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Scheduled Site Visits */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm font-display flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" />
              <span>Scheduled Site Visits</span>
            </h3>
            <Link href="/dashboard/visits" className="text-xs text-amber-600 hover:text-amber-700 font-bold">
              View All
            </Link>
          </div>

          {recentVisits.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              No site visits scheduled. Book a free guided tour on any property page!
            </p>
          ) : (
            <div className="space-y-3">
              {recentVisits.map((vis) => (
                <div key={vis.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 line-clamp-1">{vis.property.title}</span>
                    <span className={`px-2 py-0.5 font-bold text-[10px] rounded ${
                      vis.status === 'ACCEPTED' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {vis.status}
                    </span>
                  </div>
                  <div className="text-slate-600 text-[11px]">
                    <strong>Date:</strong> {vis.visitDate} ({vis.visitTime})
                  </div>
                  <div className="text-[10px] text-slate-400">{vis.property.address}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
