import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { FileText, PlusCircle, Eye, Trash2, Edit } from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Blog CMS | Admin Control Center',
};

export default async function AdminBlogPage() {
  await requireAdmin();

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
    include: { category: true },
  });

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-400" />
            <span>Blog & Editorial CMS ({posts.length})</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Publish real estate advice, market analyses, and UP RERA buying guides.
          </p>
        </div>

        <button className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 self-start sm:self-auto">
          <PlusCircle className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-300"
          >
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-700"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  {post.category && (
                    <span className="text-[10px] font-bold text-amber-400 uppercase">
                      {post.category.name}
                    </span>
                  )}
                  <span className="text-slate-500 text-[10px]">• {formatDate(post.createdAt)}</span>
                </div>
                <h3 className="font-bold text-white text-sm truncate">{post.title}</h3>
                <span className="text-[11px] text-slate-400">{post.views} Views • {post.authorName}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/blog/${post.slug}`}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg flex items-center gap-1 font-semibold text-xs"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
