import React from 'react';
import Link from 'next/link';
import { Building2, Home, Search, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 text-center bg-slate-50">
      <div className="max-w-md space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto shadow-inner">
          <Building2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-slate-900 font-display">404</h1>
          <h2 className="text-xl font-bold text-slate-800">Property or Page Not Found</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            The property listing you requested may have been sold, rented, or moved. Explore other verified homes across NCR.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="px-5 py-2.5 bg-navy-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
          >
            <Home className="w-4 h-4 text-amber-400" />
            <span>Go Home</span>
          </Link>
          <Link
            href="/properties"
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl shadow-md flex items-center gap-2"
          >
            <Search className="w-4 h-4" />
            <span>Browse Properties</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
