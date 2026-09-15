'use client';
import { useState } from 'react';
import { Plus, MapPin, Trash2 } from 'lucide-react';

type Address = { id: string; title: string; full: string };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [form, setForm] = useState({ title: '', full: '' });
  const [showForm, setShowForm] = useState(false);

  function add(e: React.FormEvent) {
    e.preventDefault();
    setAddresses([...addresses, { id: Date.now().toString(), ...form }]);
    setForm({ title: '', full: '' });
    setShowForm(false);
  }

  function remove(id: string) {
    setAddresses(addresses.filter((a) => a.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">آدرس‌های من</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1 bg-[var(--color-brand)] text-white px-4 py-2 rounded-xl text-sm font-medium">
          <Plus size={16} /> آدرس جدید
        </button>
      </div>

      {showForm && (
        <form onSubmit={add} className="bg-white border border-[var(--color-line)] rounded-2xl p-5 mb-6 flex flex-col gap-3 max-w-lg">
          <input required placeholder="عنوان آدرس (مثلاً خانه، محل کار)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border border-[var(--color-line)] rounded-xl px-4 py-2.5" />
          <textarea required placeholder="آدرس کامل" value={form.full} onChange={(e) => setForm({ ...form, full: e.target.value })} rows={3}
            className="border border-[var(--color-line)] rounded-xl px-4 py-2.5" />
          <button className="bg-[var(--color-brand)] text-white font-bold py-2.5 rounded-xl">ذخیره آدرس</button>
        </form>
      )}

      {addresses.length === 0 ? (
        <div className="bg-white border border-[var(--color-line)] rounded-2xl p-10 text-center text-gray-400 text-sm">
          هنوز آدرسی ثبت نکرده‌اید.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {addresses.map((a) => (
            <div key={a.id} className="bg-white border border-[var(--color-line)] rounded-2xl p-4 flex gap-3">
              <div className="p-2 h-fit rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand-deep)]"><MapPin size={18} /></div>
              <div className="flex-1">
                <div className="font-bold text-sm mb-1">{a.title}</div>
                <div className="text-sm text-gray-500">{a.full}</div>
              </div>
              <button onClick={() => remove(a.id)} className="p-2 text-red-500 h-fit hover:bg-red-50 rounded-xl"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-gray-400 mt-4">* برای ذخیره دائمی آدرس‌ها نیاز به یک مدل Address در بک‌اند و اتصال به دیتابیس است.</p>
    </div>
  );
}
