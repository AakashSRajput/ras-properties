import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Bell, CheckCircle2, AlertCircle, Info, Calendar, ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAuth } from '@/lib/auth';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Notifications | RAS Properties',
};

export default async function NotificationsPage() {
  const session = await requireAuth();

  const notifications = await prisma.notification.findMany({
    where: { userId: session.id },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
          <Bell className="w-6 h-6 text-amber-500" />
          <span>Notifications ({notifications.length})</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Stay informed with real-time property approvals, inquiry updates, and visit alerts.
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center mx-auto">
            <Bell className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No notifications yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You will receive updates when an advisor replies to your enquiry or when your posted property is approved.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-3.5 text-xs ${
                n.isRead ? 'bg-slate-50 border-slate-200/80' : 'bg-amber-50/50 border-amber-200 shadow-sm'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                {n.type === 'PROPERTY_APPROVED' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : n.type === 'VISIT' ? (
                  <Calendar className="w-4 h-4 text-sky-500" />
                ) : (
                  <Info className="w-4 h-4 text-amber-500" />
                )}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-xs">{n.title}</h4>
                  <span className="text-[10px] text-slate-400">{formatDate(n.createdAt)}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">{n.message}</p>

                {n.link && (
                  <Link
                    href={n.link}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 hover:text-amber-700 pt-1"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
