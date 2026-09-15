'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Trash2 } from 'lucide-react';

const EMOJI_SUGGESTIONS = ['📱', '💻', '🎧', '👕', '⌚', '📷', '🎮', '🏠', '🧴', '🍳', '📚', '🚴', '🧸', '💄'];

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('📦');

  function load() {
    api.get('/categories').then(({ data }) => setCategories(data));
  }
  useEffect(load, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post('/categories', { name, icon });
    setName('');
    setIcon('📦');
    load();
  }

  async function remove(id: string) {
    if (!confirm('حذف این دسته‌بندی؟ محصولات مرتبط با آن ممکن است دچار خطا شوند.')) return;
    try {
      await api.delete(`/categories/${id}`);
      load();
    } catch {
      alert('این دسته‌بندی دارای محصول است و قابل حذف نیست.');
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">مدیریت دسته‌بندی‌ها</h1>

      <form onSubmit={add} className="bg-white border border-[var(--color-line)] rounded-2xl p-5 mb-6 flex flex-wrap items-end gap-3">
        <div>
          <label className="text-xs font-medium mb-1 block text-gray-500">آیکون</label>
          <div className="flex items-center gap-2">
            <span className="w-11 h-11 rounded-xl bg-[var(--color-paper)] flex items-center justify-center text-xl">{icon}</span>
            <select value={icon} onChange={(e) => setIcon(e.target.value)} className="border border-[var(--color-line)] rounded-xl px-2 py-2.5 text-sm">
              {EMOJI_SUGGESTIONS.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs font-medium mb-1 block text-gray-500">نام دسته‌بندی</label>
          <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="مثلاً کتاب و لوازم‌التحریر"
            className="w-full border border-[var(--color-line)] rounded-xl px-4 py-2.5" />
        </div>
        <button className="flex items-center gap-1 bg-[var(--color-brand)] text-white px-5 py-2.5 rounded-xl text-sm font-bold h-fit">
          <Plus size={16} /> افزودن
        </button>
      </form>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
        {categories.map((c) => (
          <div key={c.id} className="bg-white border border-[var(--color-line)] rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{c.icon}</span>
              <span className="font-medium text-sm">{c.name}</span>
            </div>
            <button onClick={() => remove(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={16} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
