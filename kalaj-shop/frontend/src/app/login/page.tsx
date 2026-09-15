'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/store/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { setUser } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      router.push('/');
    } catch (err: any) {
      setError(err?.response?.data?.error || 'خطا در ورود');
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6 text-center">ورود به کالاژ</h1>
      <form onSubmit={submit} className="bg-white border border-[var(--color-line)] rounded-2xl p-6 flex flex-col gap-4">
        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</div>}
        <input required type="email" placeholder="ایمیل" value={email} onChange={(e) => setEmail(e.target.value)}
          className="border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
        <input required type="password" placeholder="رمز عبور" value={password} onChange={(e) => setPassword(e.target.value)}
          className="border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
        <button className="bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl hover:bg-[var(--color-brand-deep)]">ورود</button>
        <p className="text-sm text-center text-gray-500">حساب نداری؟ <Link href="/register" className="text-[var(--color-brand)] font-medium">ثبت‌نام کن</Link></p>
        <div className="text-xs text-gray-400 text-center border-t pt-3 mt-2">
          تست: admin@shop.ir | seller@shop.ir | customer@shop.ir — رمز: 123456
        </div>
      </form>
    </div>
  );
}
