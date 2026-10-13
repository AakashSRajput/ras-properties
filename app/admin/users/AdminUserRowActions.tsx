'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserX, UserCheck, Trash2 } from 'lucide-react';
import { showToast } from '@/components/ToastProvider';

export default function AdminUserRowActions({ user }: { user: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateUser = async (updates: any, msg: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (res.ok) {
        showToast(msg, 'success');
        router.refresh();
      } else {
        const data = await res.json();
        showToast(data.error || 'Action failed', 'error');
      }
    } catch {
      showToast('Network error during user action', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!confirm(`Are you sure you want to permanently delete user "${user.name}"?`)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('User account deleted', 'success');
        router.refresh();
      } else {
        const data = await res.json();
        showToast(data.error || 'Failed to delete user', 'error');
      }
    } catch {
      showToast('Network error while deleting user', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2">
      {/* Role Changer Select */}
      <select
        value={user.role}
        disabled={loading}
        onChange={(e) => updateUser({ role: e.target.value }, `Role updated to ${e.target.value}`)}
        className="p-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-[10px] font-bold focus:outline-none focus:border-amber-400 cursor-pointer"
      >
        <option value="USER">USER</option>
        <option value="OWNER">OWNER</option>
        <option value="AGENT">AGENT</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      {/* Suspend / Activate Toggle */}
      <button
        onClick={() => updateUser({ isSuspended: !user.isSuspended }, user.isSuspended ? 'User activated' : 'User suspended')}
        disabled={loading}
        title={user.isSuspended ? 'Activate User' : 'Suspend User'}
        className={`p-1.5 rounded-lg border transition-colors ${
          user.isSuspended
            ? 'bg-rose-950 text-rose-400 border-rose-800'
            : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-white'
        }`}
      >
        {user.isSuspended ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
      </button>

      {/* Delete User */}
      <button
        onClick={deleteUser}
        disabled={loading}
        title="Delete User"
        className="p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 hover:border-rose-800 transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
