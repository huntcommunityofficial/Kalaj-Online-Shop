'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const INFO = [
  { icon: Phone, label: 'تلفن پشتیبانی', value: '۰۲۱-۹۱۰۰۰۰۰۰' },
  { icon: Mail, label: 'ایمیل', value: 'support@kalaj.ir' },
  { icon: MapPin, label: 'آدرس', value: 'تهران، خیابان ولیعصر' },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <div>
      <section className="brand-gradient text-white text-center py-16">
        <span className="inline-block text-xs font-bold bg-white/15 px-3 py-1.5 rounded-full mb-4 backdrop-blur">تماس با ما</span>
        <h1 className="text-3xl md:text-4xl font-black">همیشه در دسترسیم</h1>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex flex-col gap-4">
          {INFO.map((i) => (
            <div key={i.label} className="bg-white border border-[var(--color-line)] rounded-2xl p-4 flex items-center gap-3 hover:shadow-layered transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand-deep)] flex items-center justify-center shrink-0">
                <i.icon size={18} />
              </div>
              <div>
                <div className="text-xs text-gray-400">{i.label}</div>
                <div className="text-sm font-bold">{i.value}</div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="md:col-span-2 bg-white border border-[var(--color-line)] rounded-2xl p-6 flex flex-col gap-4 shadow-layered">
          {sent && <div className="text-sm text-[var(--color-mint)] bg-green-50 p-3 rounded-xl">پیام شما ارسال شد ✓ به‌زودی پاسخ می‌دهیم.</div>}
          <input required placeholder="نام شما" className="border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
          <input required type="email" placeholder="ایمیل" className="border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
          <textarea required placeholder="پیام شما" rows={5} className="border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
          <button className="flex items-center justify-center gap-2 bg-[var(--color-brand)] text-white font-bold py-3.5 rounded-xl hover:bg-[var(--color-brand-deep)] hover:scale-[1.02] active:scale-95 transition-all">
            <Send size={16} /> ارسال پیام
          </button>
        </form>
      </div>
    </div>
  );
}
