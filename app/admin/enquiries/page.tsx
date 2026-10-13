import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, Phone, Mail, Calendar, Building2 } from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Customer Enquiries | Admin Control Center',
};

export default async function AdminEnquiriesPage() {
  await requireAdmin();

  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      property: {
        select: { id: true, title: true, slug: true, locality: true, city: true },
      },
      agent: true,
    },
  });

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="border-b border-slate-700 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-amber-400" />
          <span>Customer Enquiries ({enquiries.length})</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review buyer and tenant leads generated across all portal listings.
        </p>
      </div>

      <div className="space-y-3">
        {enquiries.map((enq) => (
          <div
            key={enq.id}
            className="p-4 bg-slate-900 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">{enq.name}</span>
                <span className="text-amber-400 font-mono">({enq.phone})</span>
                {enq.email && <span className="text-slate-400">{enq.email}</span>}
              </div>
              <span className="text-[10px] text-slate-400">{formatDate(enq.createdAt)}</span>
            </div>

            {enq.property && (
              <div className="text-slate-300 flex items-center gap-1">
                <span className="text-slate-500 font-semibold">Property:</span>
                <Link
                  href={`/properties/${enq.property.slug}`}
                  className="text-amber-400 hover:text-amber-300 font-semibold"
                >
                  {enq.property.title} ({enq.property.locality}, {enq.property.city})
                </Link>
              </div>
            )}

            <p className="text-slate-300 italic bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              &quot;{enq.message}&quot;
            </p>

            {enq.agent && (
              <div className="text-[11px] text-slate-400">
                Assigned Advisor: <strong className="text-white">{enq.agent.name}</strong> ({enq.agent.phone})
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
