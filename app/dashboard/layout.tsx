import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  Heart,
  MessageSquare,
  Calendar,
  Building2,
  PlusCircle,
  Bell,
  Settings,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'User Dashboard | RAS Properties',
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const navItems = [
    { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Profile', href: '/dashboard/profile', icon: User },
    { name: 'Saved Properties', href: '/dashboard/saved', icon: Heart },
    { name: 'My Enquiries', href: '/dashboard/enquiries', icon: MessageSquare },
    { name: 'Scheduled Visits', href: '/dashboard/visits', icon: Calendar },
    { name: 'My Properties', href: '/dashboard/my-properties', icon: Building2 },
    { name: 'Post Property (FREE)', href: '/dashboard/post-property', icon: PlusCircle, highlight: true },
    { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar (3 cols) */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm sticky top-24 space-y-6">
              {/* User Profile Card */}
              <div className="flex items-center gap-3.5 pb-6 border-b border-slate-100">
                <img
                  src={session.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.name}`}
                  alt={session.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400 shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 text-sm truncate">{session.name}</h3>
                  <p className="text-[11px] text-slate-400 truncate">{session.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold bg-amber-500/15 text-amber-600 rounded">
                    {session.role}
                  </span>
                </div>
              </div>

              {/* Navigation Menu */}
              <nav className="space-y-1 text-xs">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition-all ${
                        item.highlight
                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {session.role === 'ADMIN' && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold bg-navy-950 text-amber-400 hover:bg-slate-900 transition-colors mt-3"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span>Admin Control Center</span>
                  </Link>
                )}
              </nav>
            </div>
          </aside>

          {/* Main Dashboard Content Area (9 cols) */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
