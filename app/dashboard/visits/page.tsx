import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, Clock, MapPin, CheckCircle2, Building2, Phone } from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Scheduled Site Visits | RAS Properties',
};

export default async function VisitsDashboardPage() {
  const session = await requireAuth();

  const visits = await prisma.visitRequest.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
    include: {
      property: {
        select: {
          id: true,
          title: true,
          slug: true,
          address: true,
          locality: true,
          city: true,
        },
      },
      agent: true,
    },
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
          <Calendar className="w-6 h-6 text-sky-500" />
          <span>Scheduled Site Visits ({visits.length})</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your upcoming and completed property site visit appointments.
        </p>
      </div>

      {visits.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No scheduled visits yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Book a free guided tour on any property details page to inspect society amenities in person.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visits.map((vis) => (
            <div
              key={vis.id}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-sky-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 font-bold text-[10px] rounded uppercase ${
                    vis.status === 'ACCEPTED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : vis.status === 'PENDING'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {vis.status}
                  </span>
                  <span className="text-slate-400 font-medium">Visit ID: VS{vis.id.slice(-6).toUpperCase()}</span>
                </div>

                <Link href={`/properties/${vis.property.slug}`} className="block group">
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors">
                    {vis.property.title}
                  </h3>
                  <p className="text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-500" />
                    <span>{vis.property.address}, {vis.property.locality}, {vis.property.city}</span>
                  </p>
                </Link>

                <div className="flex flex-wrap items-center gap-4 text-slate-700 font-semibold pt-1">
                  <span className="flex items-center gap-1 text-slate-900">
                    <Calendar className="w-3.5 h-3.5 text-sky-500" />
                    <span>{vis.visitDate}</span>
                  </span>
                  <span className="flex items-center gap-1 text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>{vis.visitTime}</span>
                  </span>
                </div>
              </div>

              {vis.agent && (
                <div className="md:w-56 shrink-0 p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Assigned Property Executive
                  </span>
                  <div className="font-bold text-slate-900 text-xs">{vis.agent.name}</div>
                  <a
                    href={`tel:${vis.agent.phone}`}
                    className="block text-center py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[11px] rounded-lg transition-colors"
                  >
                    Contact: {vis.agent.phone}
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
