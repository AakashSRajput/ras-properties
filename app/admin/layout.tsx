import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import {
  ShieldCheck,
  Building2,
  Users,
  MessageSquare,
  Calendar,
  FileText,
  Settings,
  LayoutDashboard,
  Home,
  LogOut,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { getSession } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Admin Control Center | RAS Properties',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session || session.role !== 'ADMIN') {
    redirect('/login');
  }

  const adminNav = [
    { name: 'Analytics & Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Manage Properties', href: '/admin/properties', icon: Building2 },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'Customer Enquiries', href: '/admin/enquiries', icon: MessageSquare },
    { name: 'Site Visits', href: '/admin/visits', icon: Calendar },
    { name: 'Blog & Articles CMS', href: '/admin/blog', icon: FileText },
    { name: 'Website Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="bg-slate-900 text-slate-100 min-h-screen">
      {/* Top Admin Bar */}
      <div className="bg-navy-950 border-b border-slate-800 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="font-bold text-white text-sm font-display">
              RAS <span className="text-amber-400">ADMIN</span>
            </span>
          </Link>
          <span className="text-slate-600">|</span>
          <span className="text-xs text-amber-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            Authorized SuperAdmin Access
          </span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link
            href="/"
            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <img
              src={session.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.name}`}
              alt={session.name}
              className="w-7 h-7 rounded-full object-cover border border-amber-400"
            />
            <span className="font-semibold text-white">{session.name}</span>
          </div>
        </div>
      </div>

      {/* Admin Body (Sidebar + Content) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Admin Sidebar (3 cols) */}
          <aside className="lg:col-span-3">
            <div className="bg-slate-800/80 rounded-2xl border border-slate-700/80 p-5 shadow-xl sticky top-20 space-y-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block px-2">
                Administration Menu
              </span>

              <nav className="space-y-1 text-xs">
                {adminNav.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 font-medium transition-all"
                    >
                      <Icon className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-4 border-t border-slate-700 text-xs">
                <Link
                  href="/dashboard"
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-950 text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-sky-400" />
                  <span>Switch to User View</span>
                </Link>
              </div>
            </div>
          </aside>

          {/* Admin Main (9 cols) */}
          <main className="lg:col-span-9">{children}</main>
        </div>
      </div>
    </div>
  );
}
