import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  User,
  Share2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { prisma } from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

interface BlogDetailPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogDetailPageProps): Promise<Metadata> {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return { title: 'Article Not Found | RAS Properties' };
  }

  return {
    title: post.seoTitle || `${post.title} | RAS Properties Blog`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.featuredImage, width: 1200, height: 630, alt: post.title }],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailPageProps) {
  const post = await prisma.blogPost.findUnique({
    where: { slug: params.slug },
    include: { category: true },
  });

  if (!post) {
    notFound();
  }

  // Fetch 2 related articles
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      id: { not: post.id },
      published: true,
    },
    take: 2,
    orderBy: { views: 'desc' },
  });

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-amber-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          {post.category && (
            <span className="bg-amber-500/15 text-amber-600 font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
              {post.category.name}
            </span>
          )}

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 font-display leading-[1.2]">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-y border-slate-200 py-3">
            <div className="flex items-center gap-2">
              <img
                src={post.authorAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80'}
                alt={post.authorName}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="font-semibold text-slate-800">{post.authorName}</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(post.createdAt)}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Main Article Content */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm">
          <div className="prose prose-slate max-w-none text-slate-700 text-sm sm:text-base leading-relaxed space-y-6">
            <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed italic border-l-4 border-amber-500 pl-4">
              {post.excerpt}
            </p>

            <div className="whitespace-pre-line text-slate-700 leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Author Bio Box */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex items-center gap-4 bg-slate-50 p-6 rounded-2xl">
            <img
              src={post.authorAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80'}
              alt={post.authorName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{post.authorName}</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Senior Real Estate Research & Legal Desk at RAS Properties.
              </p>
            </div>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="space-y-4 pt-6">
            <h3 className="text-xl font-bold text-slate-900 font-display">Related Guides</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.id}
                  href={`/blog/${rPost.slug}`}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-600 transition-colors line-clamp-2">
                    {rPost.title}
                  </h4>
                  <span className="text-xs font-semibold text-amber-600 mt-3 flex items-center gap-1">
                    Read Article <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
