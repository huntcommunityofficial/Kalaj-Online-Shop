'use client';
import Link from 'next/link';
import { AtSign, Send, MessageCircle, ShieldCheck, Truck, Headphones, CreditCard } from 'lucide-react';

const COLS = [
  {
    title: 'خدمات مشتریان',
    links: [
      { label: 'پیگیری سفارش', href: '/dashboard/orders' },
      { label: 'شرایط بازگشت کالا', href: '/returns' },
      { label: 'سوالات متداول', href: '/faq' },
      { label: 'تماس با ما', href: '/contact' },
    ],
  },
  {
    title: 'درباره کالاژ',
    links: [
      { label: 'درباره ما', href: '/about' },
      { label: 'فرصت‌های شغلی', href: '/careers' },
      { label: 'قوانین و مقررات', href: '/terms' },
      { label: 'حریم خصوصی', href: '/privacy' },
    ],
  },
  {
    title: 'همکاری با ما',
    links: [
      { label: 'فروش در کالاژ', href: '/register' },
      { label: 'پنل فروشندگان', href: '/dashboard/seller' },
      { label: 'قوانین فروشندگی', href: '/seller-rules' },
    ],
  },
];

const PERKS = [
  { icon: Truck, label: 'ارسال سریع', sub: 'به سراسر کشور' },
  { icon: ShieldCheck, label: 'ضمانت اصالت', sub: 'کالای ۱۰۰٪ اصل' },
  { icon: CreditCard, label: 'پرداخت امن', sub: 'درگاه معتبر بانکی' },
  { icon: Headphones, label: 'پشتیبانی', sub: '۷ روز هفته، ۲۴ ساعته' },
];

export default function Footer() {
  return (
    <footer className="bg-[var(--color-ink)] text-white/70 mt-16">
      {/* نوار امتیازات */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {PERKS.map((p) => (
            <div key={p.label} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[var(--color-coral)] shrink-0">
                <p.icon size={20} />
              </div>
              <div>
                <div className="text-white text-sm font-bold">{p.label}</div>
                <div className="text-xs text-white/40">{p.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* لینک‌ها */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white font-black text-lg">ک</div>
            <span className="font-black text-xl text-white">کالاژ</span>
          </div>
          <p className="text-sm leading-7 max-w-xs mb-5">
            کالاژ، بازار آنلاین همه‌چیز؛ از موبایل و لپ‌تاپ تا پوشاک و لوازم جانبی، با هزاران فروشنده معتبر در کنار هم.
          </p>
          <div className="flex items-center gap-3 mb-6">
            <SocialIcon href="https://instagram.com"><AtSign size={16} /></SocialIcon>
            <SocialIcon href="https://twitter.com"><MessageCircle size={16} /></SocialIcon>
            <SocialIcon href="https://t.me"><Send size={16} /></SocialIcon>
          </div>
          <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
            <input
              placeholder="ایمیل برای عضویت در خبرنامه"
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[var(--color-coral)] placeholder:text-white/30"
            />
            <button className="bg-[var(--color-coral)] text-white text-sm font-bold px-4 py-2.5 rounded-xl hover:brightness-110">
              عضویت
            </button>
          </form>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-white font-bold mb-4 text-sm">{col.title}</h4>
            <ul className="flex flex-col gap-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* پایین‌ترین نوار */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <span>© {new Date().getFullYear()} کالاژ — تمامی حقوق محفوظ است.</span>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-white/5">نماد اعتماد الکترونیکی</span>
            <span className="px-3 py-1 rounded-lg bg-white/5">ساخته‌شده با Next.js</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[var(--color-coral)] hover:text-white transition-colors"
    >
      {children}
    </a>
  );
}
