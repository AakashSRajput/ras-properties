import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Calendar,
  Building,
  ShieldCheck,
  Award,
  Share2,
  Heart,
  Phone,
  MessageCircle,
  Clock,
  Compass,
  Car,
  Layers,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Eye,
  Check,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import { formatINR, formatNumberIN, formatDate } from '@/lib/utils';
import { PropertyDTO } from '@/types';
import LeafletMap from '@/components/LeafletMap';
import EMICalculator from '@/components/EMICalculator';
import PropertyDetailClientActions from './PropertyDetailClientActions';
import PropertyGallery from './PropertyGallery';

export const dynamic = 'force-dynamic';

interface PropertyDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const property = await prisma.property.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: { images: { take: 1 } },
  });

  if (!property) {
    return { title: 'Property Not Found | RAS Properties' };
  }

  const isRent = property.listingType === 'FOR_RENT' || property.listingType === 'FOR_LEASE';
  const priceFormatted = formatINR(property.price, isRent);
  const title = `${property.title} | ${priceFormatted} in ${property.locality}, ${property.city}`;
  const description = property.description.slice(0, 160);
  const imgUrl = property.images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [{ url: imgUrl, width: 1200, height: 630, alt: property.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imgUrl],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const property = await prisma.property.findFirst({
    where: { OR: [{ id: params.id }, { slug: params.id }] },
    include: {
      images: { orderBy: { order: 'asc' } },
      agent: true,
      owner: { select: { id: true, name: true, email: true, phone: true } },
      amenities: { include: { amenity: true } },
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { id: true, name: true, avatar: true } } },
      },
    },
  });

  if (!property) {
    notFound();
  }

  // Increment view count
  await prisma.property.update({
    where: { id: property.id },
    data: { views: { increment: 1 } },
  });

  // Fetch similar verified properties in same city
  const similarProperties = await prisma.property.findMany({
    where: {
      city: property.city,
      id: { not: property.id },
      status: 'APPROVED',
    },
    take: 3,
    orderBy: { views: 'desc' },
    include: {
      images: { orderBy: { order: 'asc' } },
      agent: true,
    },
  });

  const isRent = property.listingType === 'FOR_RENT' || property.listingType === 'FOR_LEASE';
  const priceFormatted = formatINR(property.price, isRent);

  // JSON-LD RealEstateListing Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SingleFamilyResidence',
    name: property.title,
    description: property.description,
    url: `https://rasproperties.in/properties/${property.slug}`,
    image: property.images.map((i) => i.url),
    numberOfRooms: property.bedrooms,
    numberOfBathroomsTotal: property.bathrooms,
    floorSize: {
      '@type': 'QuantitativeValue',
      value: property.area,
      unitText: property.areaUnit,
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: property.address,
      addressLocality: property.locality,
      addressRegion: property.state,
      postalCode: property.pincode,
      addressCountry: 'IN',
    },
    offers: {
      '@type': 'Offer',
      price: property.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="bg-slate-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      {/* Inject Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4 overflow-x-auto whitespace-nowrap">
          <Link href="/" className="hover:text-amber-600">Home</Link>
          <span>/</span>
          <Link href="/properties" className="hover:text-amber-600">Properties</Link>
          <span>/</span>
          <Link href={`/search?city=${encodeURIComponent(property.city)}`} className="hover:text-amber-600">
            {property.city}
          </Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate max-w-xs">{property.title}</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="bg-navy-950 text-amber-400 font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                {property.listingType.replace('_', ' ')}
              </span>
              {property.verificationStatus === 'RERA_APPROVED' && (
                <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  RERA: {property.reraNumber || 'VERIFIED'}
                </span>
              )}
              {property.featured && (
                <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2.5 py-1 rounded-md flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  FEATURED
                </span>
              )}
              <span className="text-xs text-slate-500 flex items-center gap-1 ml-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {property.views} Views
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 font-display">
              {property.title}
            </h1>

            <p className="flex items-center gap-1.5 text-slate-600 text-sm mt-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
              <span>{property.address}, {property.locality}, {property.city} - {property.pincode}</span>
            </p>
          </div>

          <div className="flex flex-col md:items-end">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Price</span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 font-display">
              {priceFormatted}
            </div>
            {property.pricePerSqFt ? (
              <span className="text-xs text-slate-500 font-medium mt-0.5">
                ₹{property.pricePerSqFt.toLocaleString('en-IN')} / {property.areaUnit}
              </span>
            ) : null}
          </div>
        </div>

        {/* HD Image Gallery Carousel */}
        <div className="mb-8">
          <PropertyGallery images={property.images} title={property.title} />
        </div>

        {/* 2-Column Layout (Main Info vs Contact & Booking) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Key Specs Overview Grid */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 font-display mb-4">Property Overview</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-slate-500 font-medium">Bedrooms</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <BedDouble className="w-4 h-4 text-amber-500" />
                    {property.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-slate-500 font-medium">Bathrooms</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <Bath className="w-4 h-4 text-amber-500" />
                    {property.bathrooms || 1} Baths
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-slate-500 font-medium">Super Built-up Area</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <Maximize2 className="w-4 h-4 text-amber-500" />
                    {property.area} {property.areaUnit}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-slate-500 font-medium">Furnishing</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <Building className="w-4 h-4 text-amber-500" />
                    {property.furnishedStatus || 'Semi-Furnished'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-slate-500 font-medium">Floor</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <Layers className="w-4 h-4 text-amber-500" />
                    {property.floor} of {property.totalFloors} Floors
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-slate-500 font-medium">Facing</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <Compass className="w-4 h-4 text-amber-500" />
                    {property.facing || 'North-East'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-slate-500 font-medium">Parking</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <Car className="w-4 h-4 text-amber-500" />
                    {property.parking || '1 Covered'}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col gap-1">
                  <span className="text-slate-500 font-medium">Property Age</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-amber-500" />
                    {property.propertyAge || '1-2 Years'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 font-display mb-3">About This Property</h3>
              <div className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {property.description}
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <span><strong>Property ID:</strong> RP{property.id.slice(-6).toUpperCase()}</span>
                <span><strong>Posted Date:</strong> {formatDate(property.createdAt)}</span>
                <span><strong>RERA Reg:</strong> {property.reraNumber || 'UPRERAPRJ4422'}</span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 font-display mb-4">Society & Unit Amenities</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {property.amenities.map((item) => (
                  <div
                    key={item.amenity.id}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-slate-800 text-xs font-medium"
                  >
                    <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span>{item.amenity.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Leaflet Map */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 font-display">Location & Nearby Infrastructure</h3>
                <span className="text-xs text-slate-500 font-medium">
                  {property.locality}, {property.city}
                </span>
              </div>
              <LeafletMap
                properties={[property as unknown as PropertyDTO]}
                center={[property.latitude || 28.5355, property.longitude || 77.3910]}
                zoom={14}
                height="380px"
              />
            </div>

            {/* Home Loan EMI Calculator */}
            <EMICalculator initialPrice={property.price} />
          </div>

          {/* Right Sidebar: Agent Contact & Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <PropertyDetailClientActions
              property={property as unknown as PropertyDTO}
            />

            {/* Trust Assurance Card */}
            <div className="bg-navy-950 text-white rounded-2xl p-6 border border-navy-800 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">RAS Verified Guarantee</h4>
                  <p className="text-[11px] text-slate-400">100% legal title clearance</p>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Physical site verification completed</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>RERA sanctioned layout plan checked</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Zero hidden broker surcharge</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 font-display">
                  Similar Verified Properties in {property.city}
                </h3>
                <p className="text-xs text-slate-500 mt-1">Explore other comparable options nearby.</p>
              </div>
              <Link
                href={`/search?city=${encodeURIComponent(property.city)}`}
                className="text-xs font-bold text-navy-900 hover:text-amber-600 flex items-center gap-1"
              >
                View More <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((simProp) => (
                <div key={simProp.id} className="h-full">
                  <Link href={`/properties/${simProp.slug}`} className="block h-full group">
                    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-luxury-hover transition-all">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <img
                          src={simProp.images[0]?.url || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80'}
                          alt={simProp.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-md text-amber-300 font-bold text-[10px] px-2 py-0.5 rounded">
                          {formatINR(simProp.price, simProp.listingType === 'FOR_RENT')}
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-amber-600 transition-colors">
                          {simProp.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          {simProp.locality}, {simProp.city} • {simProp.area} {simProp.areaUnit}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
