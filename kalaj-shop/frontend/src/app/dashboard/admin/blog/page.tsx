'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Plus, Pencil, Trash2, X, Eye, EyeOff, Upload } from 'lucide-react';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '');

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', excerpt: '', content: '', category: 'عمومی', coverImage: '' });
  const [uploading, setUploading] = useState(false);

  function load() {
    api.get('/posts/admin/all').then(({ data }) => setPosts(data));
  }
  useEffect(load, []);

  function startNew() {
    setEditing(null);
    setForm({ title: '', excerpt: '', content: '', category: 'عمومی', coverImage: '' });
    setShowForm(true);
  }

  function startEdit(p: any) {
    setEditing(p.id);
    setForm({ title: p.title, excerpt: p.excerpt, content: p.content, category: p.category, coverImage: p.coverImage || '' });
    setShowForm(true);
  }

  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('images', file);
      const { data } = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ ...form, coverImage: data.urls[0] });
    } catch {
      alert('خطا در آپلود تصویر');
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) await api.put(`/posts/${editing}`, form);
    else await api.post('/posts', form);
    setShowForm(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm('حذف این مقاله؟')) return;
    await api.delete(`/posts/${id}`);
    load();
  }

  async function togglePublish(p: any) {
    await api.put(`/posts/${p.id}`, { published: !p.published });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">مدیریت وبلاگ</h1>
        <button onClick={startNew} className="flex items-center gap-1 bg-[var(--color-brand)] text-white px-4 py-2 rounded-xl text-sm font-medium">
          <Plus size={16} /> مقاله جدید
        </button>
      </div>

      {showForm && (
        <form onSubmit={submit} className="bg-white border border-[var(--color-line)] rounded-2xl p-5 mb-6 flex flex-col gap-3 relative">
          <button type="button" onClick={() => setShowForm(false)} className="absolute top-4 left-4 text-gray-400"><X size={18} /></button>

          <div>
            <label className="text-sm font-medium mb-2 block">تصویر کاور مقاله</label>
            <div className="flex items-center gap-3">
              {form.coverImage ? (
                <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-[var(--color-line)]">
                  <img src={`${API_BASE}${form.coverImage}`} className="w-full h-full object-cover" alt="" />
                  <button type="button" onClick={() => setForm({ ...form, coverImage: '' })} className="absolute top-0.5 left-0.5 bg-black/60 text-white rounded-full p-0.5">
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <label className="w-24 h-16 rounded-xl border-2 border-dashed border-[var(--color-line)] flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[var(--color-brand)] text-gray-400 hover:text-[var(--color-brand)] transition-colors">
                  {uploading ? <span className="text-[10px]">آپلود...</span> : <><Upload size={16} /><span className="text-[10px]">کاور</span></>}
                  <input type="file" accept="image/*" hidden onChange={handleCoverUpload} disabled={uploading} />
                </label>
              )}
            </div>
          </div>

          <input required placeholder="عنوان مقاله" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
          <input placeholder="دسته‌بندی (مثلاً راهنمای خرید)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
          <textarea required placeholder="خلاصه کوتاه" value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2}
            className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
          <textarea required placeholder="متن کامل مقاله" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6}
            className="border border-[var(--color-line)] rounded-xl px-4 py-2" />
          <button className="bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl">{editing ? 'ذخیره تغییرات' : 'انتشار مقاله'}</button>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {posts.map((p) => (
          <div key={p.id} className="bg-white border border-[var(--color-line)] rounded-xl p-4 flex justify-between items-center">
            <div>
              <div className="font-medium">{p.title}</div>
              <div className="text-xs text-gray-400">{p.category} · {new Date(p.createdAt).toLocaleDateString('fa-IR')}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                {p.published ? 'منتشرشده' : 'پیش‌نویس'}
              </span>
              <button onClick={() => togglePublish(p)} className="p-2 rounded-xl hover:bg-[var(--color-paper)]" title="تغییر وضعیت انتشار">
                {p.published ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              <button onClick={() => startEdit(p)} className="p-2 rounded-xl hover:bg-[var(--color-paper)]"><Pencil size={16} /></button>
              <button onClick={() => remove(p.id)} className="p-2 rounded-xl text-red-500 hover:bg-red-50"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
