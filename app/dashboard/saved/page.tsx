import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Search, Building2 } from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import PropertyCard from '@/components/PropertyCard';
import { PropertyDTO } from '@/types';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Saved Properties | RAS Properties',
};

export default async function SavedPropertiesPage() {
  const session = await requireAuth();

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
    include: {
      property: {
        include: {
          images: { orderBy: { order: 'asc' } },
          agent: true,
        },
      },
    },
  });

  const properties = favorites.map((f) => ({
    ...f.property,
    isFavorited: true,
  }));

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Saved Properties ({properties.length})</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Properties you have bookmarked for quick comparison and site visits.
          </p>
        </div>

        <Link
          href="/properties"
          className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 self-start sm:self-auto"
        >
          <Search className="w-3.5 h-3.5" />
          <span>Browse More Properties</span>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No saved properties yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click the heart icon on any property card to save it to your personal shortlist.
          </p>
          <Link
            href="/properties"
            className="inline-block mt-2 px-5 py-2.5 bg-navy-900 text-amber-400 text-xs font-bold rounded-xl shadow-sm hover:bg-slate-800"
          >
            Explore Properties
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <PropertyCard key={prop.id} property={prop as unknown as PropertyDTO} />
          ))}
        </div>
      )}
    </div>
  );
}
