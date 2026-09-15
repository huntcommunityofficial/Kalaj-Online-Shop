'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';

export default function AdminSettingsPage() {
  const [announcement, setAnnouncement] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/settings').then(({ data }) => setAnnouncement(data.announcement)).finally(() => setLoading(false));
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await api.put('/settings/announcement', { value: announcement });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">تنظیمات سایت</h1>
      {loading ? (
        <div className="text-gray-400 text-sm">در حال بارگذاری...</div>
      ) : (
        <form onSubmit={save} className="bg-white border border-[var(--color-line)] rounded-2xl p-6 max-w-xl flex flex-col gap-4">
          {saved && <div className="text-sm text-[var(--color-mint)] bg-green-50 p-2 rounded-lg">ذخیره شد ✓</div>}
          <div>
            <label className="text-sm font-medium mb-1 block">متن نوار اطلاعیه بالای سایت</label>
            <input value={announcement} onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
            <p className="text-xs text-gray-400 mt-1">همین متن بالای سایت برای همه کاربران نمایش داده می‌شود.</p>
          </div>
          <button className="bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl hover:bg-[var(--color-brand-deep)] w-fit px-6">ذخیره</button>
        </form>
      )}
    </div>
  );
}
