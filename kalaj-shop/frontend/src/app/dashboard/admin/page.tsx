'use client';
import { useEffect, useState } from 'react';
import api, { toman } from '@/lib/api';
import { Users, Package, ShoppingBag, TrendingUp, Check, X, Plus, Tag } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pending, setPending] = useState<any[]>([]);
  const [codes, setCodes] = useState<any[]>([]);
  const [form, setForm] = useState({ code: '', type: 'PERCENT', value: '', maxUses: '' });

  function load() {
    api.get('/admin/stats').then(({ data }) => setStats(data));
    api.get('/admin/products/pending').then(({ data }) => setPending(data));
    api.get('/discounts').then(({ data }) => setCodes(data));
  }
  useEffect(load, []);

  async function approve(id: string) { await api.put(`/admin/products/${id}/approve`); load(); }
  async function reject(id: string) { await api.put(`/admin/products/${id}/reject`); load(); }

  async function createCode(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/discounts', form);
    setForm({ code: '', type: 'PERCENT', value: '', maxUses: '' });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">پنل ادمین</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Users size={20} />} label="کاربران" value={stats.users} />
          <StatCard icon={<Package size={20} />} label="محصولات" value={stats.products} />
          <StatCard icon={<ShoppingBag size={20} />} label="سفارش‌ها" value={stats.orderCount} />
          <StatCard icon={<TrendingUp size={20} />} label="درآمد کل" value={toman(stats.revenue)} />
        </div>
      )}

      <h2 className="font-bold text-lg mb-3">محصولات در انتظار تایید</h2>
      <div className="flex flex-col gap-2 mb-10">
        {pending.length === 0 && <p className="text-gray-400 text-sm">موردی برای تایید وجود ندارد.</p>}
        {pending.map((p) => (
          <div key={p.id} className="bg-white border border-[var(--color-line)] rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-500">{toman(p.price)} · فروشنده: {p.seller?.storeName}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => approve(p.id)} className="p-2 bg-green-100 text-green-700 rounded-xl"><Check size={16} /></button>
              <button onClick={() => reject(p.id)} className="p-2 bg-red-100 text-red-700 rounded-xl"><X size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="font-bold text-lg mb-3">کدهای تخفیف</h2>
      <form onSubmit={createCode} className="bg-white border border-[var(--color-line)] rounded-2xl p-5 mb-4 grid md:grid-cols-4 gap-3">
        <input required placeholder="کد (مثلاً OFF20)" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2">
          <option value="PERCENT">درصدی</option>
          <option value="FIXED">مبلغ ثابت</option>
        </select>
        <input required type="number" placeholder="مقدار" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
        <input type="number" placeholder="حداکثر تعداد استفاده" value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
        <button className="md:col-span-4 flex items-center justify-center gap-1 bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl">
          <Plus size={16} /> ساخت کد تخفیف
        </button>
      </form>
      <div className="flex flex-col gap-2">
        {codes.map((c) => (
          <div key={c.id} className="bg-white border border-[var(--color-line)] rounded-xl p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 font-mono font-bold"><Tag size={14} /> {c.code}</div>
            <div className="text-sm text-gray-500">
              {c.type === 'PERCENT' ? `٪${c.value}` : toman(c.value)} · استفاده: {c.usedCount}{c.maxUses ? `/${c.maxUses}` : ''}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white border border-[var(--color-line)] rounded-2xl p-4 flex items-center gap-3">
      <div className="p-2 rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand-deep)]">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-bold price">{value}</div>
      </div>
    </div>
  );
}
