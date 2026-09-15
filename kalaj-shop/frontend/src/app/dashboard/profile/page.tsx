'use client';
import { useState } from 'react';
import { useAuth } from '@/store/auth';

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [saved, setSaved] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // نکته: برای ذخیره واقعی نیاز به یک روت PUT /api/auth/me در بک‌اند است
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">تنظیمات پروفایل</h1>
      <form onSubmit={submit} className="bg-white border border-[var(--color-line)] rounded-2xl p-6 max-w-lg flex flex-col gap-4">
        {saved && <div className="text-sm text-[var(--color-mint)] bg-green-50 p-2 rounded-lg">تغییرات ذخیره شد ✓</div>}
        <div>
          <label className="text-sm font-medium mb-1 block">نام و نام‌خانوادگی</label>
          <input value={name} onChange={(e) => setName(e.target.value)}
            className="w-full border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">ایمیل</label>
          <input value={user?.email} disabled
            className="w-full border border-[var(--color-line)] rounded-xl px-4 py-3 bg-gray-50 text-gray-400" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1 block">رمز عبور جدید</label>
          <input type="password" placeholder="در صورت تمایل به تغییر رمز پر کنید"
            className="w-full border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
        </div>
        <button className="bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl hover:bg-[var(--color-brand-deep)]">ذخیره تغییرات</button>
      </form>
    </div>
  );
}
