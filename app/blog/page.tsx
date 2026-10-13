import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Sparkles, Calendar, Clock, ArrowRight, User, BookOpen } from 'lucide-react';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Real Estate Blog & Market Intelligence | RAS Properties',
  description:
    'Stay ahead with the latest Indian real estate trends, RERA guidance, property price analysis, and home buying tips for Noida, Greater Noida, and Gurgaon.',
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { category?: string; search?: string };
}) {
  const categorySlug = searchParams.category;
  const search = searchParams.search;

  const where: any = { published: true };
  if (categorySlug) {
    where.category = { slug: categorySlug };
  }
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { excerpt: { contains: search } },
      { content: { contains: search } },
    ];
  }

  const [posts, categories] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    }),
    prisma.blogCategory.findMany({
      include: { _count: { select: { posts: true } } },
    }),
  ]);

  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 uppercase tracking-widest mb-1">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Market Intelligence & Advice</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-display tracking-tight">
            RAS Properties Insights
          </h1>
          <p className="text-sm text-slate-600 mt-2">
            Expert analysis, RERA legal breakdowns, and high-growth neighborhood spotlights across NCR.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              !categorySlug
                ? 'bg-navy-900 text-amber-400 shadow-md'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Categories
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/blog?category=${cat.slug}`}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                categorySlug === cat.slug
                  ? 'bg-navy-900 text-amber-400 shadow-md'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {cat.name} ({cat._count.posts})
            </Link>
          ))}
        </div>

        {/* Hero Featured Blog Post */}
        {featuredPost && (
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-luxury transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-7 aspect-[16/10] overflow-hidden">
                <Link href={`/blog/${featuredPost.slug}`}>
                  <img
                    src={featuredPost.featuredImage}
                    alt={featuredPost.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </Link>
              </div>
              <div className="lg:col-span-5 p-6 sm:p-8 space-y-4">
                {featuredPost.category && (
                  <span className="bg-amber-500/15 text-amber-600 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
                    {featuredPost.category.name}
                  </span>
                )}
                <Link href={`/blog/${featuredPost.slug}`} className="block">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 font-display hover:text-amber-600 transition-colors leading-snug">
                    {featuredPost.title}
                  </h2>
                </Link>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <img
                      src={featuredPost.authorAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80'}
                      alt={featuredPost.authorName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-semibold text-slate-700">{featuredPost.authorName}</span>
                  </div>
                  <span>{featuredPost.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 hover:border-amber-400/50 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between"
            >
              <div>
                <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden block">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  {post.category && (
                    <span className="absolute top-3 left-3 bg-navy-950/80 backdrop-blur-md text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded">
                      {post.category.name}
                    </span>
                  )}
                </Link>
                <div className="p-5">
                  <div className="text-[11px] text-slate-400 mb-2 font-medium">
                    {formatDate(post.createdAt)} • {post.readTime}
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-amber-600 transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between text-xs mt-2">
                <span className="font-semibold text-slate-700">{post.authorName}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
                >
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
