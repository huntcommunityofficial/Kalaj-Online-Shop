'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  { q: 'چطور سفارشم را پیگیری کنم؟', a: 'از بخش «سفارش‌های من» در داشبورد حساب کاربری‌تان می‌توانید وضعیت هر سفارش را ببینید.' },
  { q: 'آیا امکان مرجوع کردن کالا وجود دارد؟', a: 'بله، طبق شرایط بازگشت کالا تا ۷ روز پس از تحویل امکان مرجوعی وجود دارد.' },
  { q: 'چطور فروشنده کالاژ شوم؟', a: 'از صفحه ثبت‌نام، گزینه «فروشنده» را انتخاب کنید و پس از تایید ادمین محصولات‌تان نمایش داده می‌شود.' },
  { q: 'روش‌های پرداخت چیست؟', a: 'پرداخت از طریق درگاه‌های معتبر بانکی و به‌صورت آنلاین انجام می‌شود.' },
  { q: 'هزینه ارسال چقدر است؟', a: 'برای خریدهای بالای ۵۰۰ هزار تومان ارسال رایگان است، در غیر این‌صورت هزینه بر اساس مقصد محاسبه می‌شود.' },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div>
      <section className="brand-gradient text-white text-center py-16">
        <span className="inline-block text-xs font-bold bg-white/15 px-3 py-1.5 rounded-full mb-4 backdrop-blur">راهنما</span>
        <h1 className="text-3xl md:text-4xl font-black">سوالات متداول</h1>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-16 flex flex-col gap-3">
        {FAQS.map((f, i) => (
          <div key={f.q} className="bg-white border border-[var(--color-line)] rounded-2xl overflow-hidden hover:shadow-layered transition-shadow">
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-right">
              <span className="font-bold">{f.q}</span>
              <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${open === i ? 'rotate-180 text-[var(--color-brand)]' : 'text-gray-400'}`} />
            </button>
            <div
              className="overflow-hidden transition-all duration-300"
              style={{ maxHeight: open === i ? '200px' : '0px' }}
            >
              <p className="px-5 pb-5 text-sm text-gray-500 leading-7">{f.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
