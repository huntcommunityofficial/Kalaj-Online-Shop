'use client';
import Link from 'next/link';
import { Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 animate-float">🧭</div>
        <h1 className="text-6xl font-black text-[var(--color-brand)] mb-3">۴۰۴</h1>
        <h2 className="text-xl font-bold mb-3">این صفحه پیدا نشد</h2>
        <p className="text-gray-500 mb-8 leading-7">
          به‌نظر می‌رسه صفحه‌ای که دنبالش بودی جابه‌جا شده یا وجود نداره. نگران نباش، بریم یه جای دیگه رو نگاه کنیم.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className="flex items-center gap-2 bg-[var(--color-brand)] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[var(--color-brand-deep)] hover:scale-105 active:scale-95 transition-all">
            <Home size={17} /> صفحه اصلی
          </Link>
          <Link href="/?q=" className="flex items-center gap-2 bg-white border border-[var(--color-line)] font-bold px-6 py-3 rounded-2xl hover:shadow-layered transition-all">
            <Search size={17} /> جستجو
          </Link>
        </div>
      </div>
    </div>
  );
}
