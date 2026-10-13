import React from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Award,
  Building2,
  Users,
  CheckCircle2,
  TrendingUp,
  MapPin,
  ArrowRight,
  PhoneCall,
  Sparkles,
  Home as HomeIcon,
  Layers,
  Key,
  BadgeCheck,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import HeroSearch from '@/components/HeroSearch';
import PropertyCard from '@/components/PropertyCard';
import { PropertyDTO } from '@/types';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch real featured properties from PostgreSQL / SQLite via Prisma
  const [featuredProperties, popularLocations, recentBlogs, totalPropertiesCount] = await Promise.all([
    prisma.property.findMany({
      where: {
        status: 'APPROVED',
        featured: true,
      },
      take: 6,
      orderBy: { views: 'desc' },
      include: {
        images: { orderBy: { order: 'asc' } },
        agent: true,
      },
    }),
    prisma.location.findMany({
      where: { isPopular: true },
      take: 6,
      orderBy: { propertyCount: 'desc' },
    }),
    prisma.blogPost.findMany({
      where: { published: true },
      take: 3,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.property.count({ where: { status: 'APPROVED' } }),
  ]);

  const propertyCategories = [
    { name: 'Luxury Apartments', count: '28+ Listings', icon: Building2, href: '/search?type=Apartment' },
    { name: 'Independent Villas', count: '12+ Listings', icon: HomeIcon, href: '/search?type=Villa' },
    { name: 'Society Flats', count: '35+ Listings', icon: Layers, href: '/search?type=Flat' },
    { name: 'Builder Floors', count: '16+ Listings', icon: Key, href: '/search?type=Builder+Floor' },
    { name: 'Commercial Offices', count: '14+ Listings', icon: TrendingUp, href: '/commercial' },
    { name: 'Residential Plots', count: '8+ Listings', icon: MapPin, href: '/search?type=Plot' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[620px] lg:min-h-[680px] flex items-center justify-center pt-12 pb-20 px-4 sm:px-6 lg:px-8 bg-navy-950 overflow-hidden">
        {/* Background Image with Dark Gradient Tint */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=80"
            alt="RAS Properties Luxury Real Estate"
            className="w-full h-full object-cover opacity-25 scale-105 transform motion-safe:animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/90 via-navy-950/70 to-navy-950" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto w-full flex flex-col items-center text-center">
          {/* Top Trust Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold mb-6 shadow-inner backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>North India&apos;s Most Trusted Real Estate Marketplace</span>
          </div>

          {/* Main Hero Headings */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-display tracking-tight leading-[1.15] max-w-4xl mb-4">
            Find Your <span className="text-amber-400 underline decoration-amber-400/40 decoration-wavy">Perfect Property</span> in India
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto font-medium mb-10 leading-relaxed">
            Discover 100% verified homes, luxury apartments, builder floors, and commercial spaces across Noida, Greater Noida, Ghaziabad, Gurgaon, and Delhi NCR.
          </p>

          {/* Hero Search Interface */}
          <HeroSearch />
        </div>
      </section>

      {/* 2. KEY STATS & TRUST BADGES BAR */}
      <section className="bg-navy-900 border-y border-navy-800 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="border-r border-navy-800/80 last:border-0 pr-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">₹450+ Cr</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Property Value Managed</div>
          </div>
          <div className="border-r border-navy-800/80 last:border-0 pr-2">
            <div className="text-2xl sm:text-3xl font-black text-white font-display">{totalPropertiesCount}+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Verified Real Listings</div>
          </div>
          <div className="border-r border-navy-800/80 last:border-0 pr-2">
            <div className="text-2xl sm:text-3xl font-black text-amber-400 font-display">1,800+</div>
            <div className="text-xs text-slate-400 font-medium mt-1">Happy Indian Families</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-display">100%</div>
            <div className="text-xs text-slate-400 font-medium mt-1">RERA Legal Compliance</div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES (REAL DATABASE DATA) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Handpicked For You</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
              Featured Properties
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              High-demand residential and commercial properties with verified documents.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-amber-600 transition-colors group"
          >
            <span>View All ({totalPropertiesCount})</span>
            <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {featuredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop as unknown as PropertyDTO} />
          ))}
        </div>
      </section>

      {/* 4. EXPLORE BY PROPERTY CATEGORIES */}
      <section className="py-16 bg-slate-100/70 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
              Explore by Property Type
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Tailored categories designed to match your specific lifestyle and investment goals.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {propertyCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={cat.href}
                  className="group bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-amber-400/60 shadow-sm hover:shadow-luxury transition-all text-center flex flex-col items-center justify-center gap-3"
                >
                  <div className="w-12 h-12 rounded-xl bg-slate-50 group-hover:bg-amber-500 text-slate-700 group-hover:text-slate-950 flex items-center justify-center transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-xs sm:text-sm group-hover:text-amber-600 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. POPULAR INDIAN LOCALITIES */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <MapPin className="w-4 h-4 text-amber-500" />
            <span>Top Real Estate Corridors</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
            Explore Properties by Popular Cities
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Prime residential communities with top schools, metro stations, IT hubs, and expressways.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularLocations.map((loc) => (
            <Link
              key={loc.id}
              href={`/search?city=${encodeURIComponent(loc.city)}&locality=${encodeURIComponent(loc.locality)}`}
              className="group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all"
            >
              <img
                src={loc.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'}
                alt={`${loc.locality}, ${loc.city}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/40 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                  {loc.city}, {loc.state}
                </span>
                <h3 className="text-lg font-bold font-display group-hover:text-amber-300 transition-colors">
                  {loc.locality}
                </h3>
                <div className="flex items-center justify-between text-xs text-slate-300 mt-1">
                  <span>{loc.propertyCount || 10}+ Verified Properties</span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1 font-semibold">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. WHY CHOOSE RAS PROPERTIES */}
      <section className="py-16 bg-navy-950 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
              Why Homebuyers & Investors Trust <span className="text-amber-400">RAS Properties</span>
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              We eliminate real estate friction through legal rigor, transparent pricing, and personalized advisory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">100% RERA Verified</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every listed project is verified for land title deeds, UP-RERA registration, and occupancy clearance before publication.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                <BadgeCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Brokerage on Direct</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Enjoy transparent negotiation directly with verified property owners and top Grade-A builders with zero hidden fees.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Dedicated Advisor</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get a dedicated senior property relationship manager for personalized site tours, home loan processing, and registry support.
              </p>
            </div>

            <div className="bg-slate-900/80 p-6 rounded-2xl border border-slate-800 flex flex-col gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                <PhoneCall className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Instant WhatsApp Connect</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Receive instant floor layouts, master brochures, and customized payment schedules directly on WhatsApp within minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. LATEST REAL ESTATE ARTICLES & MARKET NEWS */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Knowledge Center</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-display tracking-tight">
              Real Estate News & Buying Guides
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              In-depth market intelligence, circle rate updates, and legal advice from NCR experts.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-navy-900 hover:text-amber-600 transition-colors group"
          >
            <span>Read All Articles</span>
            <ArrowRight className="w-4 h-4 text-amber-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {recentBlogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-amber-400/50 shadow-sm hover:shadow-luxury transition-all flex flex-col"
            >
              <Link href={`/blog/${blog.slug}`} className="relative aspect-[16/10] overflow-hidden block">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                {blog.category && (
                  <span className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded">
                    {blog.category.name}
                  </span>
                )}
              </Link>
              <div className="p-5 flex flex-col flex-1 justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 mb-2 font-medium">
                    {formatDate(blog.createdAt)} • {blog.readTime}
                  </div>
                  <Link href={`/blog/${blog.slug}`}>
                    <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-amber-600 transition-colors line-clamp-2 mb-2">
                      {blog.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">{blog.authorName}</span>
                  <Link
                    href={`/blog/${blog.slug}`}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                  >
                    Read More <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. HIGH-CONVERSION CTA BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-12">
        <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-navy-800 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="relative z-10 max-w-xl">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Are you a Property Owner or Agent?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-1 mb-3">
              List Your Property for <span className="text-amber-400">FREE</span> on RAS Properties
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Connect with thousands of genuine, pre-qualified homebuyers, corporate tenants, and commercial investors looking for properties in your locality.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/dashboard/post-property"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-105"
            >
              <span>Post Your Property (Free)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+919871234567"
              className="w-full sm:w-auto px-6 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm rounded-xl border border-slate-700 flex items-center justify-center gap-2 transition-all"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span>Call Advisor</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
