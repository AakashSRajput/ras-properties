import React from 'react';
import { Metadata } from 'next';
import { Users, ShieldCheck, UserCheck, UserX, Trash2 } from 'lucide-react';
import { prisma } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { formatDate } from '@/lib/utils';
import AdminUserRowActions from './AdminUserRowActions';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'User Management | Admin Control Center',
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: { role?: string; search?: string };
}) {
  await requireAdmin();

  const role = searchParams.role;
  const search = searchParams.search;

  const where: any = {};
  if (role) where.role = role;
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { email: { contains: search } },
      { phone: { contains: search } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { properties: true, enquiries: true, favorites: true } },
    },
  });

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700 p-6 sm:p-8 shadow-xl space-y-6">
      <div className="border-b border-slate-700 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-white font-display flex items-center gap-2">
          <Users className="w-6 h-6 text-sky-400" />
          <span>User & Role Management ({users.length})</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Promote roles (USER, OWNER, AGENT, ADMIN), suspend fraudulent accounts, or remove users.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300 border-collapse">
          <thead>
            <tr className="border-b border-slate-700 text-[11px] font-bold text-slate-400 uppercase tracking-wider bg-slate-900/50">
              <th className="p-3">User</th>
              <th className="p-3">Role</th>
              <th className="p-3">Activity</th>
              <th className="p-3">Status</th>
              <th className="p-3">Joined Date</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name}`}
                      alt={u.name}
                      className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-white">{u.name}</div>
                      <div className="text-[10px] text-slate-400">{u.email} {u.phone ? `• ${u.phone}` : ''}</div>
                    </div>
                  </div>
                </td>

                <td className="p-3">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                    u.role === 'ADMIN'
                      ? 'bg-amber-950 text-amber-400 border border-amber-800'
                      : u.role === 'AGENT'
                      ? 'bg-purple-950 text-purple-400 border border-purple-800'
                      : u.role === 'OWNER'
                      ? 'bg-sky-950 text-sky-400 border border-sky-800'
                      : 'bg-slate-900 text-slate-300 border border-slate-700'
                  }`}>
                    {u.role}
                  </span>
                </td>

                <td className="p-3 text-slate-400">
                  <span>{u._count.properties} Props</span> • <span>{u._count.enquiries} Enquiries</span>
                </td>

                <td className="p-3">
                  <span className={`text-[10px] font-bold ${u.isSuspended ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {u.isSuspended ? 'Suspended' : 'Active'}
                  </span>
                </td>

                <td className="p-3 text-slate-400 text-[11px]">
                  {formatDate(u.createdAt)}
                </td>

                <td className="p-3 text-right">
                  <AdminUserRowActions user={u} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
