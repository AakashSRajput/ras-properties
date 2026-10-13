import React from 'react';
import { Metadata } from 'next';
import { prisma } from '@/lib/db';
import PropertyCard from '@/components/PropertyCard';
import PropertyFilters from '@/components/PropertyFilters';
import LeafletMap from '@/components/LeafletMap';
import { PropertyDTO } from '@/types';
import { Building2, MapPin, SlidersHorizontal, Map as MapIcon, Grid } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'All Properties | Buy, Rent & Commercial in Noida & Delhi NCR',
  description:
    'Search through verified apartments, villas, builder floors, and commercial spaces across Noida, Greater Noida, Ghaziabad, Gurgaon, and Delhi NCR.',
};

interface PropertiesPageProps {
  searchParams: {
    city?: string;
    locality?: string;
    type?: string;
    listingType?: string;
    commercialOnly?: string;
    minPrice?: string;
    maxPrice?: string;
    bedrooms?: string;
    bathrooms?: string;
    furnished?: string;
    verified?: string;
    featured?: string;
    search?: string;
    sortBy?: string;
    page?: string;
    view?: string; // 'grid' | 'map'
  };
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const city = searchParams.city;
  const locality = searchParams.locality;
  const propertyType = searchParams.type;
  const listingType = searchParams.listingType;
  const commercialOnly = searchParams.commercialOnly === 'true';
  const minPrice = searchParams.minPrice;
  const maxPrice = searchParams.maxPrice;
  const bedrooms = searchParams.bedrooms;
  const bathrooms = searchParams.bathrooms;
  const furnished = searchParams.furnished;
  const verified = searchParams.verified === 'true';
  const featured = searchParams.featured === 'true';
  const search = searchParams.search;
  const sortBy = searchParams.sortBy || 'newest';
  const page = parseInt(searchParams.page || '1', 10);
  const limit = 12;
  const skip = (page - 1) * limit;
  const viewMode = searchParams.view || 'grid';

  const where: any = {
    status: 'APPROVED',
  };

  if (city) where.city = { contains: city };
  if (locality) where.locality = { contains: locality };
  if (propertyType) where.propertyType = propertyType;
  if (commercialOnly) {
    where.propertyType = {
      in: ['Office', 'Shop', 'Showroom', 'Warehouse', 'Commercial Building', 'Industrial Property'],
    };
  }
  if (listingType) where.listingType = listingType;

  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  if (bedrooms) {
    const b = parseInt(bedrooms, 10);
    where.bedrooms = b >= 5 ? { gte: 5 } : b;
  }

  if (bathrooms) {
    const b = parseInt(bathrooms, 10);
    where.bathrooms = b >= 4 ? { gte: 4 } : b;
  }

  if (furnished) where.furnishedStatus = furnished;
  if (verified) where.verificationStatus = { in: ['VERIFIED', 'RERA_APPROVED'] };
  if (featured) where.featured = true;

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { locality: { contains: search } },
      { city: { contains: search } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sortBy === 'price_asc') orderBy = { price: 'asc' };
  if (sortBy === 'price_desc') orderBy = { price: 'desc' };
  if (sortBy === 'views_desc') orderBy = { views: 'desc' };
  if (sortBy === 'oldest') orderBy = { createdAt: 'asc' };

  const [properties, totalCount] = await Promise.all([
    prisma.property.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        images: { orderBy: { order: 'asc' } },
        agent: true,
      },
    }),
    prisma.property.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  // Helper to build URL preserving search params
  const createPageUrl = (targetPage: number) => {
    const p = new URLSearchParams(searchParams as Record<string, string>);
    p.set('page', targetPage.toString());
    return `/properties?${p.toString()}`;
  };

  const createViewUrl = (targetView: string) => {
    const p = new URLSearchParams(searchParams as Record<string, string>);
    p.set('view', targetView);
    return `/properties?${p.toString()}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Breadcrumb & Titles */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <Link href="/" className="hover:text-amber-600">Home</Link>
              <span>/</span>
              <span className="text-slate-800 font-semibold">Properties</span>
              {city && (
                <>
                  <span>/</span>
                  <span className="text-amber-600 font-semibold">{city}</span>
                </>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-display">
              {city ? `Properties in ${city}` : 'Properties for Sale & Rent in Delhi NCR'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Showing <span className="font-bold text-slate-800">{properties.length}</span> of{' '}
              <span className="font-bold text-slate-800">{totalCount}</span> verified listings
            </p>
          </div>

          {/* Grid / Map View Toggle */}
          <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm self-start md:self-auto">
            <Link
              href={createViewUrl('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'grid'
                  ? 'bg-navy-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Grid View</span>
            </Link>
            <Link
              href={createViewUrl('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'map'
                  ? 'bg-navy-900 text-amber-400 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </Link>
          </div>
        </div>

        {/* Main 2-Column Content Layout (Sidebar + Results) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Filters */}
          <div className="lg:col-span-1">
            <PropertyFilters initialListingType={listingType} />
          </div>

          {/* Right Results: Grid or Leaflet Map */}
          <div className="lg:col-span-3">
            {viewMode === 'map' ? (
              <div className="space-y-6">
                <LeafletMap
                  properties={properties as unknown as PropertyDTO[]}
                  height="600px"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {properties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop as unknown as PropertyDTO} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                {properties.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
                    <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-slate-800">No properties match your exact criteria</h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                      Try adjusting your budget range, removing filter conditions, or selecting a broader city.
                    </p>
                    <Link
                      href="/properties"
                      className="inline-block mt-4 px-4 py-2 bg-amber-500 text-slate-950 text-xs font-bold rounded-lg hover:bg-amber-400"
                    >
                      Clear All Filters
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {properties.map((prop) => (
                      <PropertyCard key={prop.id} property={prop as unknown as PropertyDTO} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    {page > 1 && (
                      <Link
                        href={createPageUrl(page - 1)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                      >
                        Previous
                      </Link>
                    )}

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => (
                      <Link
                        key={pNum}
                        href={createPageUrl(pNum)}
                        className={`w-9 h-9 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${
                          pNum === page
                            ? 'bg-navy-900 text-amber-400 shadow-md'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pNum}
                      </Link>
                    ))}

                    {page < totalPages && (
                      <Link
                        href={createPageUrl(page + 1)}
                        className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
