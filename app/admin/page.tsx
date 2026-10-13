import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Users,
  Building2,
  Clock,
  ShieldCheck,
  Award,
  MessageSquare,
  Calendar,
  Eye,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { formatNumberIN, formatDate } from '@/lib/utils';
import AdminCharts from './AdminCharts';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin Dashboard Analytics | RAS Properties',
};

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [
    totalUsers,
    totalProperties,
    pendingProperties,
    verifiedProperties,
    featuredProperties,
    totalEnquiries,
    totalVisits,
    totalAgents,
    viewsAggregate,
    propertyTypesGroup,
    listingTypesGroup,
    recentEnquiries,
    recentProperties,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.property.count(),
    prisma.property.count({ where: { status: 'PENDING_APPROVAL' } }),
    prisma.property.count({ where: { verificationStatus: { in: ['VERIFIED', 'RERA_APPROVED'] } } }),
    prisma.property.count({ where: { featured: true } }),
    prisma.enquiry.count(),
    prisma.visitRequest.count(),
    prisma.agent.count(),
    prisma.property.aggregate({ _sum: { views: true } }),
    prisma.property.groupBy({
      by: ['propertyType'],
      _count: { id: true },
    }),
    prisma.property.groupBy({
      by: ['listingType'],
      _count: { id: true },
    }),
    prisma.enquiry.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { property: { select: { title: true, slug: true } } },
    }),
    prisma.property.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: { id: true, title: true, slug: true, status: true, city: true, price: true, createdAt: true },
    }),
  ]);

  const chartPropertyTypes = propertyTypesGroup.map((pt) => ({
    name: pt.propertyType,
    value: pt._count.id,
  }));

  const chartListingTypes = listingTypesGroup.map((lt) => ({
    name: lt.listingType.replace('_', ' '),
    value: lt._count.id,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white font-display">
          System Overview & Metrics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Real-time PostgreSQL database performance, user growth, and listing pipeline.
        </p>
      </div>

      {/* 8 Metric KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Users</span>
            <Users className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">{totalUsers}</div>
          <div className="text-[10px] text-slate-400 mt-1">Registered Accounts</div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Total Properties</span>
            <Building2 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">{totalProperties}</div>
          <div className="text-[10px] text-slate-400 mt-1">Database Listings</div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Pending Review</span>
            <Clock className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400 font-display">{pendingProperties}</div>
          <div className="text-[10px] text-slate-400 mt-1">Awaiting Approval</div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Verified & RERA</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 font-display">{verifiedProperties}</div>
          <div className="text-[10px] text-slate-400 mt-1">Vetted Listings</div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Customer Enquiries</span>
            <MessageSquare className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">{totalEnquiries}</div>
          <div className="text-[10px] text-slate-400 mt-1">Total Inquiries</div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Site Visits</span>
            <Calendar className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">{totalVisits}</div>
          <div className="text-[10px] text-slate-400 mt-1">Booked Inspections</div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Active Agents</span>
            <Award className="w-4 h-4 text-yellow-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">{totalAgents}</div>
          <div className="text-[10px] text-slate-400 mt-1">Certified Advisors</div>
        </div>

        <div className="bg-slate-800/80 p-5 rounded-2xl border border-slate-700 shadow-md">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Listing Views</span>
            <Eye className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-black text-white font-display">
            {formatNumberIN(viewsAggregate._sum.views || 0)}
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Property Page Views</div>
        </div>
      </div>

      {/* Interactive Charts Component */}
      <AdminCharts
        propertyTypes={chartPropertyTypes}
        listingTypes={chartListingTypes}
      />

      {/* 2-Column: Recent Properties & Recent Inquiries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Listings */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 className="font-bold text-white text-sm">Recent Property Additions</h3>
            <Link href="/admin/properties" className="text-xs text-amber-400 hover:text-amber-300 font-bold">
              Manage All
            </Link>
          </div>
          <div className="space-y-2.5">
            {recentProperties.map((p) => (
              <div key={p.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                <div className="min-w-0 pr-3">
                  <div className="font-bold text-white truncate">{p.title}</div>
                  <div className="text-[11px] text-slate-400">{p.city} • {formatDate(p.createdAt)}</div>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase shrink-0 ${
                  p.status === 'APPROVED' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Enquiries */}
        <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-700">
            <h3 className="font-bold text-white text-sm">Recent Customer Enquiries</h3>
            <Link href="/admin/enquiries" className="text-xs text-amber-400 hover:text-amber-300 font-bold">
              Manage All
            </Link>
          </div>
          <div className="space-y-2.5">
            {recentEnquiries.map((enq) => (
              <div key={enq.id} className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{enq.name} ({enq.phone})</span>
                  <span className="text-[10px] text-slate-400">{formatDate(enq.createdAt)}</span>
                </div>
                <p className="text-slate-400 text-[11px] truncate italic">&quot;{enq.message}&quot;</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
