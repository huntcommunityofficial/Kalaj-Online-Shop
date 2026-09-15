'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/store/auth';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' });
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/register', form);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'خطا در ثبت‌نام');
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">ساخت حساب کاربری</h1>
      <form onSubmit={submit} className="bg-white border border-[var(--color-line)] rounded-2xl p-6 flex flex-col gap-4">
        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</div>}
        <input required placeholder="نام و نام‌خانوادگی" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
        <input required type="email" placeholder="ایمیل" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
        <input required type="password" placeholder="رمز عبور" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
        <div className="flex gap-3">
          <button type="button" onClick={() => setForm({ ...form, role: 'CUSTOMER' })}
            className={`flex-1 py-3 rounded-xl border font-medium ${form.role === 'CUSTOMER' ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]' : 'border-[var(--color-line)]'}`}>مشتری</button>
          <button type="button" onClick={() => setForm({ ...form, role: 'SELLER' })}
            className={`flex-1 py-3 rounded-xl border font-medium ${form.role === 'SELLER' ? 'bg-[var(--color-brand)] text-white border-[var(--color-brand)]' : 'border-[var(--color-line)]'}`}>فروشنده</button>
        </div>
        <button className="bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl hover:bg-[var(--color-brand-deep)]">ثبت‌نام</button>
        <p className="text-sm text-center text-gray-500">حساب داری؟ <Link href="/login" className="text-[var(--color-brand)] font-medium">وارد شو</Link></p>
      </form>
    </div>
  );
}
