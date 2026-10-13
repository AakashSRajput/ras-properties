import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import {
  Building2,
  ShieldCheck,
  Award,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Search,
  Filter,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { formatINR, formatDate } from '@/lib/utils';
import AdminPropertyRowActions from './AdminPropertyRowActions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Manage Properties | Admin Control Center',
};

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: { status?: string; search?: string; city?: string };
}) {
  await requireAdmin();

  const statusFilter = searchParams.status;
  const search = searchParams.search;
  const city = searchParams.city;

  const where: any = {};
  if (statusFilter) where.status = statusFilter;
  if (city) where.city = { contains: city };
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { locality: { contains: search } },
      { city: { contains: search } },
      { reraNumber: { contains: search } },
    ];
  }

  const properties = await prisma.property.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      images: { take: 1 },
      owner: { select: { id: true, name: true, email: true } },
      agent: { select: { id: true, name: true, phone: true } },
    },
  });

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
            <Building2 className="w-6 h-6 text-amber-400" />
            <span>Manage Properties ({properties.length})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Approve, verify, feature, or remove property listings across India.
          </p>
        </div>

        {/* Quick Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
          <Link
            href="/admin/properties"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              !statusFilter ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            All
          </Link>
          <Link
            href="/admin/properties?status=PENDING_APPROVAL"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === 'PENDING_APPROVAL' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Pending
          </Link>
          <Link
            href="/admin/properties?status=APPROVED"
            className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
              statusFilter === 'APPROVED' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
            }`}
          >
            Approved
          </Link>
        </div>
      </div>

      {/* Properties Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/50">
              <th className="p-3">Property</th>
              <th className="p-3">Price & Type</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3">RERA / Verified</th>
              <th className="p-3">Featured</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {properties.map((prop) => (
              <tr key={prop.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={prop.images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}
                      alt={prop.title}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div className="min-w-0 max-w-xs">
                      <Link
                        href={`/properties/${prop.slug}`}
                        className="font-bold text-white hover:text-amber-400 transition-colors line-clamp-1 block"
                      >
                        {prop.title}
                      </Link>
                      <span className="text-[10px] text-slate-400">
                        RP{prop.id.slice(-6).toUpperCase()} • {formatDate(prop.createdAt)}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="p-3">
                  <div className="font-bold text-amber-400 font-display">
                    {formatINR(prop.price, prop.listingType === 'FOR_RENT')}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    {prop.propertyType} ({prop.listingType.replace('_', ' ')})
                  </div>
                </td>

                <td className="p-3">
                  <div className="text-white font-medium">{prop.locality}</div>
                  <div className="text-[10px] text-slate-400">{prop.city}</div>
                </td>

                <td className="p-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    prop.status === 'APPROVED'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : prop.status === 'PENDING_APPROVAL'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : 'bg-rose-950 text-rose-400 border border-rose-800'
                  }`}>
                    {prop.status.replace('_', ' ')}
                  </span>
                </td>

                <td className="p-3">
                  <span className={`text-[10px] font-bold ${
                    prop.verificationStatus === 'RERA_APPROVED'
                      ? 'text-emerald-400'
                      : prop.verificationStatus === 'VERIFIED'
                      ? 'text-sky-400'
                      : 'text-slate-400'
                  }`}>
                    {prop.verificationStatus.replace('_', ' ')}
                  </span>
                </td>

                <td className="p-3">
                  <span className={`text-[10px] font-bold ${prop.featured ? 'text-amber-400' : 'text-slate-500'}`}>
                    {prop.featured ? '★ Yes' : 'No'}
                  </span>
                </td>

                <td className="p-3 text-right">
                  <AdminPropertyRowActions property={prop} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
