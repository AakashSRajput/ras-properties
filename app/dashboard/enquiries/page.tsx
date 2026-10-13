import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, Phone, Mail, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { formatDate, formatINR } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Enquiries | RAS Properties',
};

export default async function EnquiriesDashboardPage() {
  const session = await requireAuth();

  const enquiries = await prisma.enquiry.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
    include: {
      property: {
        include: { images: { take: 1 } },
      },
      agent: true,
    },
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-amber-500" />
          <span>My Enquiries ({enquiries.length})</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track the status and agent responses for all your property inquiries.
        </p>
      </div>

      {enquiries.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <MessageSquare className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No active enquiries</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When you enquire about an apartment, villa, or office, you can track response updates here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {enquiries.map((enq) => (
            <div
              key={enq.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-400/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 font-bold text-[10px] rounded uppercase ${
                    enq.status === 'NEW'
                      ? 'bg-amber-100 text-amber-800'
                      : enq.status === 'CONTACTED'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {enq.status}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Submitted on {formatDate(enq.createdAt)}
                  </span>
                </div>

                {enq.property ? (
                  <Link href={`/properties/${enq.property.slug}`} className="block group">
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                      {enq.property.title}
                    </h3>
                    <p className="text-slate-500 mt-0.5">
                      {enq.property.locality}, {enq.property.city} • {formatINR(enq.property.price, false)}
                    </p>
                  </Link>
                ) : (
                  <h3 className="font-bold text-slate-900 text-sm">General Property Consultation</h3>
                )}

                <p className="text-slate-700 bg-white p-3 rounded-xl border border-slate-200/60 italic">
                  &quot;{enq.message}&quot;
                </p>

                {enq.notes && (
                  <p className="text-emerald-700 font-medium bg-emerald-50 p-2 rounded-lg">
                    Advisor Note: {enq.notes}
                  </p>
                )}
              </div>

              {enq.agent && (
                <div className="md:w-56 shrink-0 p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Assigned Advisor
                  </span>
                  <div className="flex items-center gap-2">
                    <img
                      src={enq.agent.photo || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80'}
                      alt={enq.agent.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{enq.agent.name}</div>
                      <div className="text-[10px] text-slate-500">{enq.agent.phone}</div>
                    </div>
                  </div>
                  <a
                    href={`tel:${enq.agent.phone}`}
                    className="block text-center py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition-colors"
                  >
                    Call Advisor
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
