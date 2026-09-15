'use client';
import { useEffect, useState } from 'react';
import api, { toman } from '@/lib/api';
import { Package, Wallet, ShoppingBag, TrendingUp, Plus } from 'lucide-react';

export default function SellerDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', price: '', stock: '', categoryId: '' });

  function load() {
    api.get('/seller/stats').then(({ data }) => setStats(data));
    api.get('/seller/products').then(({ data }) => setProducts(data));
  }

  useEffect(() => {
    load();
    api.get('/categories').then(({ data }) => setCategories(data));
  }, []);

  async function submitProduct(e: React.FormEvent) {
    e.preventDefault();
    await api.post('/products', { ...form, images: [] });
    setForm({ title: '', description: '', price: '', stock: '', categoryId: '' });
    setShowForm(false);
    load();
  }

  const STATUS_FA: Record<string, string> = { PENDING: 'در انتظار تایید', APPROVED: 'تاییدشده', REJECTED: 'ردشده' };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">پنل فروشنده</h1>

      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Package size={20} />} label="تعداد محصولات" value={stats.productCount} />
          <StatCard icon={<ShoppingBag size={20} />} label="تعداد فروش" value={stats.itemsSold} />
          <StatCard icon={<TrendingUp size={20} />} label="مجموع فروش" value={toman(stats.totalSales)} />
          <StatCard icon={<Wallet size={20} />} label="موجودی کیف پول" value={toman(stats.balance)} />
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-lg">محصولات من</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 bg-[var(--color-brand)] text-white px-4 py-2 rounded-xl text-sm font-medium">
          <Plus size={16} /> محصول جدید
        </button>
      </div>

      {showForm && (
        <form onSubmit={submitProduct} className="bg-white border border-[var(--color-line)] rounded-2xl p-5 mb-6 grid md:grid-cols-2 gap-3">
          <input required placeholder="عنوان محصول" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
          <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2">
            <option value="">دسته‌بندی</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input required type="number" placeholder="قیمت (تومان)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
          <input required type="number" placeholder="موجودی" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
          <textarea required placeholder="توضیحات" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2 md:col-span-2" rows={3} />
          <button className="bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl md:col-span-2">ثبت محصول (نیازمند تایید ادمین)</button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {products.map((p) => (
          <div key={p.id} className="bg-white border border-[var(--color-line)] rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-500">{toman(p.price)} · موجودی: {p.stock}</div>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.status === 'APPROVED' ? 'bg-green-100 text-green-700' : p.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
              {STATUS_FA[p.status]}
            </span>
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
