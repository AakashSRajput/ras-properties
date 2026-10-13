'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { showToast } from '@/components/ToastProvider';

export default function MyPropertyDeleteButton({
  propertyId,
  propertyTitle,
}: {
  propertyId: string;
  propertyTitle: string;
}) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${propertyTitle}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        showToast('Property listing deleted successfully', 'success');
        router.refresh();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete listing', 'error');
      }
    } catch {
      showToast('Network error while deleting listing', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg border border-rose-200 flex items-center gap-1 font-bold text-xs transition-colors disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
      <span>{deleting ? 'Deleting...' : 'Delete'}</span>
    </button>
  );
}
