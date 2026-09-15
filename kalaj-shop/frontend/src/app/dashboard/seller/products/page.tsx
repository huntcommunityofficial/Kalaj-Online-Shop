'use client';
import { useEffect, useState } from 'react';
import api, { toman } from '@/lib/api';
import { Plus, Pencil, Trash2, X, Upload, ImageIcon } from 'lucide-react';

const STATUS_FA: Record<string, string> = { PENDING: 'در انتظار تایید', APPROVED: 'تاییدشده', REJECTED: 'ردشده' };
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '');

export default function SellerProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', price: '', stock: '', categoryId: '' });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  function load() {
    api.get('/seller/products').then(({ data }) => setProducts(data));
  }
  useEffect(() => {
    load();
    api.get('/categories').then(({ data }) => setCategories(data));
  }, []);

  function startEdit(p: any) {
    setEditing(p.id);
    setForm({ title: p.title, description: p.description, price: String(p.price), stock: String(p.stock), categoryId: p.categoryId });
    setImages(p.images ? JSON.parse(p.images) : []);
    setShowForm(true);
  }

  function startNew() {
    setEditing(null);
    setForm({ title: '', description: '', price: '', stock: '', categoryId: '' });
    setImages([]);
    setShowForm(true);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append('images', f));
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setImages([...images, ...data.urls]);
    } catch (err) {
      alert('خطا در آپلود تصویر');
    } finally {
      setUploading(false);
    }
  }

  function removeImage(url: string) {
    setImages(images.filter((i) => i !== url));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { ...form, images };
    if (editing) {
      await api.put(`/products/${editing}`, payload);
    } else {
      await api.post('/products', payload);
    }
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm('حذف این محصول؟')) return;
    await api.delete(`/products/${id}`);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">محصولات من</h1>
        <button onClick={startNew} className="flex items-center gap-1 bg-[var(--color-brand)] text-white px-4 py-2 rounded-xl text-sm font-medium">
          <Plus size={16} /> محصول جدید
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white border border-[var(--color-line)] rounded-2xl p-5 mb-6 grid md:grid-cols-2 gap-3 relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 left-4 text-gray-400"><X size={18} /></button>

          <div className="md:col-span-2">
            <label className="text-sm font-medium mb-2 block">تصاویر محصول</label>
            <div className="flex flex-wrap gap-3">
              {images.map((url) => (
                <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden border border-[var(--color-line)]">
                  <img src={`${API_BASE}${url}`} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(url)} className="absolute top-0.5 left-0.5 bg-black/60 text-white rounded-full p-0.5">
                    <X size={12} />
                  </button>
                </div>
              ))}
              <label className="w-20 h-20 rounded-xl border-2 border-dashed border-[var(--color-line)] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[var(--color-brand)] text-gray-400 hover:text-[var(--color-brand)] transition-colors">
                {uploading ? <span className="text-[10px]">در حال آپلود...</span> : <><Upload size={18} /><span className="text-[10px]">افزودن</span></>}
                <input type="file" accept="image/*" multiple hidden onChange={handleFileUpload} disabled={uploading} />
              </label>
            </div>
          </div>

          <input required placeholder="عنوان محصول" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
          <select required value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2">
            <option value="">دسته‌بندی</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input required type="number" placeholder="قیمت (تومان)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
          <input required type="number" placeholder="موجودی" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
          <textarea required placeholder="توضیحات" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border border-[var(--color-line)] rounded-xl px-4 py-2 md:col-span-2" rows={3} />
          <button className="bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl md:col-span-2">
            {editing ? 'ذخیره تغییرات' : 'ثبت محصول (نیازمند تایید ادمین)'}
          </button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {products.map((p) => {
          const imgs = p.images ? JSON.parse(p.images) : [];
          return (
            <div key={p.id} className="bg-white border border-[var(--color-line)] rounded-xl p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-[var(--color-paper)] flex items-center justify-center overflow-hidden shrink-0">
                  {imgs[0] ? <img src={`${API_BASE}${imgs[0]}`} className="w-full h-full object-cover" alt="" /> : <ImageIcon size={18} className="text-gray-300" />}
                </div>
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="text-sm text-gray-500">{toman(p.price)} · موجودی: {p.stock}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${p.status === 'APPROVED' ? 'bg-green-100 text-green-700' : p.status === 'REJECTED' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                  {STATUS_FA[p.status]}
                </span>
                <button onClick={() => startEdit(p)} className="p-2 rounded-xl hover:bg-[var(--color-paper)]"><Pencil size={16} /></button>
                <button onClick={() => remove(p.id)} className="p-2 rounded-xl text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
