'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

const ROLE_FA: Record<string, string> = { CUSTOMER: 'مشتری', SELLER: 'فروشنده', ADMIN: 'ادمین' };

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data));
  }, []);

  const filtered = users.filter((u) => u.name.includes(q) || u.email.includes(q));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">مدیریت کاربران</h1>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجوی نام یا ایمیل..."
          className="border border-[var(--color-line)] rounded-xl px-4 py-2 text-sm w-64" />
      </div>
      <div className="bg-white border border-[var(--color-line)] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-paper)] text-gray-500">
            <tr>
              <th className="text-right px-4 py-3 font-medium">نام</th>
              <th className="text-right px-4 py-3 font-medium">ایمیل</th>
              <th className="text-right px-4 py-3 font-medium">نقش</th>
              <th className="text-right px-4 py-3 font-medium">تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-t border-[var(--color-line)]">
                <td className="px-4 py-3">{u.name}</td>
                <td className="px-4 py-3 text-gray-500">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand-deep)]">
                    {ROLE_FA[u.role]}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString('fa-IR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
