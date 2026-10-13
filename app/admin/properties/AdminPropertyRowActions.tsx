'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, ShieldCheck, Award, Trash2, Eye } from 'lucide-react';
import { showToast } from '@/components/ToastProvider';

export default function AdminPropertyRowActions({ property }: { property: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateProperty = async (updates: any, successMsg: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/properties/${property.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        showToast(successMsg, 'success');
        router.refresh();
      } else {
        const data = await res.json();
        showToast(data.error || 'Action failed', 'error');
      }
    } catch {
      showToast('Network error during action', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteProperty = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${property.title}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/properties/${property.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast('Property permanently deleted', 'success');
        router.refresh();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete', 'error');
      }
    } catch {
      showToast('Network error while deleting', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      {/* Approve / Reject Toggle */}
      {property.status !== 'APPROVED' ? (
        <button
          onClick={() => updateProperty({ status: 'APPROVED' }, 'Property Approved!')}
          disabled={loading}
          title="Approve Property"
          className="p-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-400 rounded-lg border border-emerald-800 transition-colors"
        >
          <Check className="w-3.5 h-3.5" />
        </button>
      ) : (
        <button
          onClick={() => updateProperty({ status: 'REJECTED' }, 'Property Rejected')}
          disabled={loading}
          title="Reject Property"
          className="p-1.5 bg-rose-950 hover:bg-rose-900 text-rose-400 rounded-lg border border-rose-800 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Feature / Unfeature */}
      <button
        onClick={() => updateProperty({ featured: !property.featured }, property.featured ? 'Featured badge removed' : 'Marked as Featured!')}
        disabled={loading}
        title={property.featured ? 'Remove Featured' : 'Mark as Featured'}
        className={`p-1.5 rounded-lg border transition-colors ${
          property.featured
            ? 'bg-amber-950 hover:bg-amber-900 text-amber-400 border-amber-800'
            : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-700'
        }`}
      >
        <Award className="w-3.5 h-3.5" />
      </button>

      {/* Delete */}
      <button
        onClick={deleteProperty}
        disabled={loading}
        title="Delete Property"
        className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 hover:border-rose-800 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
