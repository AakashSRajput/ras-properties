import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, MapPin, Building2, Phone } from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Site Visit Requests | Admin Control Center',
};

export default async function AdminVisitsPage() {
  await requireAdmin();

  const visits = await prisma.visitRequest.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      property: {
        select: { id: true, title: true, slug: true, address: true, locality: true, city: true },
      },
      agent: true,
    },
  });

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="border-b border-slate-700 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
          <Calendar className="w-6 h-6 text-purple-400" />
          <span>Site Visit Requests ({visits.length})</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Monitor scheduled buyer property inspections and agent coordination.
        </p>
      </div>

      <div className="space-y-3">
        {visits.map((vis) => (
          <div
            key={vis.id}
            className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{vis.name}</span>
                <span className="text-amber-400 font-mono">({vis.phone})</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  vis.status === 'ACCEPTED'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {vis.status}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">{formatDate(vis.createdAt)}</span>
            </div>

            <div className="text-slate-300">
              <span className="text-slate-500 font-semibold">Inspection Property: </span>
              <Link
                href={`/properties/${vis.property.slug}`}
                className="text-amber-400 hover:text-amber-300 font-semibold"
              >
                {vis.property.title}
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-slate-300 font-semibold">
              <span className="text-sky-400">Date: {vis.visitDate}</span>
              <span className="text-sky-400">Time: {vis.visitTime}</span>
              <span className="text-slate-400 font-normal">{vis.property.address}, {vis.property.city}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
