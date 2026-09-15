import Link from 'next/link';
import { Sparkles, Users, Package, ShieldCheck, Rocket, Heart } from 'lucide-react';

const VALUES = [
  { icon: ShieldCheck, title: 'اعتماد', text: 'ضمانت اصالت کالا و شفافیت کامل در تمام مراحل خرید.' },
  { icon: Rocket, title: 'سرعت', text: 'ارسال سریع و پردازش لحظه‌ای سفارش‌ها در سراسر کشور.' },
  { icon: Heart, title: 'مشتری‌مداری', text: 'پشتیبانی ۲۴ ساعته و گوش‌شنوا برای هر بازخورد.' },
];

const STATS = [
  { icon: Users, value: '۱۲,۰۰۰+', label: 'مشتری راضی' },
  { icon: Package, value: '۳۴,۰۰۰+', label: 'محصول متنوع' },
  { icon: Sparkles, value: '۸۵۰+', label: 'فروشنده فعال' },
];

export default function About() {
  return (
    <div>
      <section className="brand-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 75% 65%, white 1px, transparent 1px)', backgroundSize: '55px 55px' }} />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center relative">
          <span className="inline-block text-xs font-bold bg-white/15 px-3 py-1.5 rounded-full mb-5 backdrop-blur">درباره کالاژ</span>
          <h1 className="text-3xl md:text-5xl font-black mb-5 tracking-tight leading-tight">
            بازاری که برای همه ساخته شده
          </h1>
          <p className="text-white/80 text-lg max-w-xl mx-auto leading-8">
            کالاژ، بازار آنلاین چندفروشندگی است که خرید و فروش انواع کالا را برای مشتریان و فروشندگان ساده، سریع و امن می‌کند.
          </p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-600 leading-9 text-lg">
          داستان کالاژ از یک ایده ساده شروع شد: خرید آنلاین باید سریع، شفاف و لذت‌بخش باشد. امروز هزاران فروشنده در کنار هم،
          از موبایل و لپ‌تاپ گرفته تا پوشاک و لوازم جانبی را در یک بازار یکپارچه عرضه می‌کنند، و ما هر روز تلاش می‌کنیم این تجربه را بهتر کنیم.
        </p>
      </section>

      <section className="bg-white border-y border-[var(--color-line)] py-14">
        <div className="max-w-5xl mx-auto px-4 grid md:grid-cols-3 gap-6">
          {VALUES.map((v) => (
            <div key={v.title} className="text-center p-6 rounded-3xl hover:shadow-layered transition-shadow">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-brand)]/10 text-[var(--color-brand-deep)] flex items-center justify-center mx-auto mb-4">
                <v.icon size={26} />
              </div>
              <h3 className="font-bold mb-2">{v.title}</h3>
              <p className="text-sm text-gray-500 leading-7">{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="bg-[var(--color-ink)] rounded-3xl px-6 py-12 grid grid-cols-3 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <s.icon size={22} className="mx-auto mb-2 text-[var(--color-coral)]" />
              <div className="text-2xl md:text-3xl font-black text-white price">{s.value}</div>
              <div className="text-white/50 text-xs md:text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-4 pb-20 text-center">
        <h2 className="font-bold text-xl mb-3">می‌خوای فروشنده کالاژ بشی؟</h2>
        <p className="text-gray-500 mb-6">به جمع صدها فروشنده فعال بپیوند و کسب‌وکارت رو گسترش بده.</p>
        <Link href="/register" className="inline-block bg-[var(--color-brand)] text-white font-bold px-7 py-3.5 rounded-2xl hover:bg-[var(--color-brand-deep)] hover:scale-105 active:scale-95 transition-all">
          شروع فروش در کالاژ
        </Link>
      </section>
    </div>
  );
}
