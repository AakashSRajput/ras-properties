import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Building2, PlusCircle, Eye, Trash2, Edit, ShieldCheck, Award } from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { formatINR, formatDate } from '@/lib/utils';
import MyPropertyDeleteButton from './MyPropertyDeleteButton';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Properties | RAS Properties',
};

export default async function MyPropertiesPage() {
  const session = await requireAuth();

  const properties = await prisma.property.findMany({
    where: { ownerId: session.id },
    orderBy: { createdAt: 'desc' },
    include: {
      images: { take: 1 },
      _count: { select: { enquiries: true, visitRequests: true } },
    },
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Building2 className="w-6 h-6 text-sky-600" />
            <span>My Property Listings ({properties.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage properties you have posted on RAS Properties marketplace.
          </p>
        </div>

        <Link
          href="/dashboard/post-property"
          className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post New Property</span>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-500 flex items-center justify-center mx-auto">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">You haven&apos;t posted any properties yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Post your residential flat, independent house, or commercial office for free and receive verified buyer leads.
          </p>
          <Link
            href="/dashboard/post-property"
            className="inline-block mt-2 px-5 py-2.5 bg-amber-500 text-slate-950 text-xs font-bold rounded-xl shadow-md hover:bg-amber-400"
          >
            Post Property for Free
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="flex items-start gap-4">
                <img
                  src={prop.images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=400&q=80'}
                  alt={prop.title}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 border border-slate-200"
                />
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 font-bold text-[10px] rounded uppercase ${
                      prop.status === 'APPROVED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : prop.status === 'PENDING_APPROVAL'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {prop.status.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      {prop.listingType.replace('_', ' ')} • {prop.propertyType}
                    </span>
                  </div>

                  <Link href={`/properties/${prop.slug}`}>
                    <h3 className="font-bold text-slate-900 text-sm hover:text-amber-600 transition-colors line-clamp-1">
                      {prop.title}
                    </h3>
                  </Link>

                  <p className="text-slate-500 truncate">
                    {prop.locality}, {prop.city} • {prop.area} {prop.areaUnit}
                  </p>

                  <div className="text-sm font-black text-slate-900 font-display">
                    {formatINR(prop.price, prop.listingType === 'FOR_RENT')}
                  </div>
                </div>
              </div>

              {/* Stats & Actions */}
              <div className="flex flex-wrap md:flex-col items-center md:items-end justify-between gap-2 pt-2 md:pt-0 border-t md:border-0 border-slate-200">
                <div className="flex items-center gap-4 text-slate-500 text-xs">
                  <span><strong>{prop.views}</strong> Views</span>
                  <span><strong>{prop._count.enquiries}</strong> Leads</span>
                  <span><strong>{prop._count.visitRequests}</strong> Visits</span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/properties/${prop.slug}`}
                    className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 flex items-center gap-1 font-bold text-xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Preview</span>
                  </Link>
                  <MyPropertyDeleteButton propertyId={prop.id} propertyTitle={prop.title} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
