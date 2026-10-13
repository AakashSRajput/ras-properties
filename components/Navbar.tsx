'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Building2,
  Phone,
  Mail,
  User as UserIcon,
  Heart,
  PlusCircle,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Bell,
  ChevronDown,
} from 'lucide-react';
import { UserSession } from '@/types';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [session, setSession] = useState<UserSession | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Fetch current session from lightweight client endpoint or cookie status
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setSession(data.user);
          } else {
            setSession(null);
          }
        } else {
          setSession(null);
        }
      } catch {
        setSession(null);
      }
    }
    checkAuth();
  }, [pathname]);

  // Handle scroll detection for sticky glass effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setSession(null);
      setUserDropdownOpen(false);
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout error:', e);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Buy', href: '/buy' },
    { name: 'Rent', href: '/rent' },
    { name: 'Commercial', href: '/commercial' },
    { name: 'All Properties', href: '/properties' },
    { name: 'Agents', href: '/agents' },
    { name: 'About', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Bar for Indian Trust & Contact Information */}
      <div className="bg-navy-950 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-navy-800 hidden md:flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5 text-amber-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            UP RERA Registered: UPRERAAGT20240982
          </span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300">Noida • Greater Noida • Ghaziabad • Gurgaon • Delhi NCR</span>
        </div>
        <div className="flex items-center gap-6">
          <a
            href="tel:+919871234567"
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-400" />
            +91 98712 34567
          </a>
          <a
            href="mailto:contact@rasproperties.in"
            className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
          >
            <Mail className="w-3.5 h-3.5 text-amber-400" />
            contact@rasproperties.in
          </a>
        </div>
      </div>

      {/* Main Navbar */}
      <div
        className={`w-full transition-all duration-200 ${
          scrolled
            ? 'bg-slate-900/95 backdrop-blur-md shadow-lg border-b border-slate-800 py-3'
            : 'bg-navy-900 border-b border-navy-800 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-navy-950 font-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-1">
                RAS <span className="text-amber-400">PROPERTIES</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-medium -mt-1">
                Your Trusted Partner
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-400 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-800 text-white px-3 py-1.5 rounded-full border border-slate-700 transition-all text-sm font-medium"
                >
                  {session.avatar ? (
                    <img
                      src={session.avatar}
                      alt={session.name}
                      className="w-7 h-7 rounded-full object-cover border border-amber-400/50"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-500 text-navy-950 font-bold flex items-center justify-center text-xs">
                      {session.name.charAt(0)}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate">{session.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-slide-up text-sm"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="font-semibold text-white truncate">{session.name}</p>
                      <p className="text-xs text-slate-400 truncate">{session.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-300 rounded">
                        {session.role}
                      </span>
                    </div>

                    <Link
                      href="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-amber-400" />
                      User Dashboard
                    </Link>

                    <Link
                      href="/dashboard/saved"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-rose-400" />
                      Saved Properties
                    </Link>

                    <Link
                      href="/dashboard/notifications"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    >
                      <Bell className="w-4 h-4 text-sky-400" />
                      Notifications
                    </Link>

                    {session.role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 font-medium transition-colors"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Control Panel
                      </Link>
                    )}

                    <div className="border-t border-slate-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-rose-400 hover:bg-rose-500/10 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="text-slate-300 hover:text-white text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-slate-800/80 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-slate-300 hover:text-white text-sm font-medium px-3.5 py-2 rounded-lg hover:bg-slate-800/80 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Post Property CTA Button */}
            <Link
              href="/dashboard/post-property"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold text-sm px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Property</span>
              <span className="bg-slate-950 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                Free
              </span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/dashboard/post-property"
              className="bg-amber-500 text-slate-950 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 sm:hidden"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Post
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-out Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 shadow-2xl animate-fade-in">
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg text-sm font-medium ${
                  pathname === link.href
                    ? 'bg-amber-500/20 text-amber-400 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="border-t border-slate-800 my-2 pt-3 flex flex-col gap-2">
              {session ? (
                <>
                  <div className="px-4 py-2 bg-slate-800/60 rounded-lg flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{session.name}</p>
                      <p className="text-xs text-slate-400">{session.email}</p>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-semibold bg-amber-500/20 text-amber-400 rounded">
                      {session.role}
                    </span>
                  </div>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-2.5 text-sm text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 flex items-center gap-2"
                  >
                    <LayoutDashboard className="w-4 h-4 text-amber-400" />
                    Dashboard
                  </Link>
                  {session.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-2.5 text-sm text-amber-400 font-medium rounded-lg bg-amber-500/10 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      Admin Control Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="px-4 py-2.5 text-sm text-rose-400 rounded-lg hover:bg-rose-500/10 text-left flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 bg-amber-500 text-slate-950 rounded-xl text-sm font-semibold"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
