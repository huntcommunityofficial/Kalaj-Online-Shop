'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import Reveal from '@/components/Reveal';
import CategoryTile from '@/components/CategoryTile';
import CountUp from '@/components/CountUp';
import Magnetic from '@/components/Magnetic';
import RippleWrapper from '@/components/RippleWrapper';
import TextReveal from '@/components/TextReveal';
import Link from 'next/link';
import { Truck, ShieldCheck, CreditCard, Headphones, Sparkles } from 'lucide-react';

const CATS = [
  { slug: 'mobile', name: 'موبایل', icon: '📱' },
  { slug: 'laptop', name: 'لپ‌تاپ', icon: '💻' },
  { slug: 'accessories', name: 'لوازم جانبی', icon: '🎧' },
  { slug: 'fashion', name: 'پوشاک', icon: '👕' },
];

const STATS = [
  { value: 12000, suffix: '+', label: 'مشتری راضی' },
  { value: 850, suffix: '+', label: 'فروشنده فعال' },
  { value: 34000, suffix: '+', label: 'محصول متنوع' },
  { value: 24, suffix: '/7', label: 'پشتیبانی آنلاین' },
];

const TRUST_ITEMS = [
  { icon: Truck, label: 'ارسال سریع سراسری' },
  { icon: ShieldCheck, label: 'ضمانت اصالت کالا' },
  { icon: CreditCard, label: 'پرداخت امن' },
  { icon: Headphones, label: 'پشتیبانی ۲۴ ساعته' },
  { icon: Sparkles, label: 'تخفیف‌های ویژه روزانه' },
];

function HomeContent() {
  const params = useSearchParams();
  const q = params.get('q') || '';
  const category = params.get('category') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);
  const isHome = !q && !category;

  useEffect(() => {
    setLoading(true);
    const query: any = {};
    if (q) query.q = q;
    if (category) query.category = category;
    if (sort) query.sort = sort;
    api.get('/products', { params: query }).then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  }, [q, category, sort]);

  return (
    <div>
      {isHome && (
        <>
          {/* هیرو */}
          <section className="gradient-mesh noise-texture text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 30%, white 1px, transparent 1px), radial-gradient(circle at 70% 70%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
            <div className="absolute -top-20 -left-20 w-72 h-72 bg-[var(--color-coral)]/30 blur-3xl animate-blob pointer-events-none" />
            <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-white/10 blur-3xl animate-blob pointer-events-none" style={{ animationDelay: '2s' }} />
            <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 flex items-center gap-10 relative">
              <div className="flex-1">
                <span className="inline-block text-xs font-bold bg-white/15 px-3 py-1.5 rounded-full mb-4 backdrop-blur animate-fade-up">
                  ✨ بیش از ۳۴ هزار محصول در انتظار شماست
                </span>
                <h1 className="text-4xl md:text-6xl font-black leading-[1.15] mb-5 tracking-tight">
                  <TextReveal text="هر چی بخوای، اینجا پیدا می‌کنی" className="text-gradient-animated" />
                </h1>
                <p className="text-white/80 mb-8 max-w-md text-lg leading-8 animate-fade-up" style={{ animationDelay: '500ms' }}>
                  از موبایل و لپ‌تاپ تا پوشاک و لوازم جانبی؛ با تخفیف‌های ویژه و ارسال سریع.
                </p>
                <div className="animate-fade-up" style={{ animationDelay: '650ms' }}>
                  <Magnetic>
                    <RippleWrapper className="rounded-2xl">
                      <Link href="#products" className="inline-block bg-white text-[var(--color-brand-deep)] font-bold px-7 py-3.5 rounded-2xl hover:scale-105 active:scale-95 transition-transform shadow-brand-glow animate-pulse-glow">
                        شروع خرید
                      </Link>
                    </RippleWrapper>
                  </Magnetic>
                </div>
              </div>
              <div className="hidden md:flex text-9xl animate-float drop-shadow-2xl">🛒</div>
            </div>
          </section>

          {/* نوار اعتماد در حال اسکرول */}
          <div className="bg-white border-b border-[var(--color-line)] overflow-hidden py-3">
            <div className="flex gap-12 animate-marquee w-max">
              {[...TRUST_ITEMS, ...TRUST_ITEMS].map((t, i) => (
                <div key={i} className="flex items-center gap-2 text-sm font-medium text-gray-500 shrink-0">
                  <t.icon size={16} className="text-[var(--color-brand)]" /> {t.label}
                </div>
              ))}
            </div>
          </div>

          {/* Bento Grid دسته‌بندی‌ها */}
          <section className="max-w-7xl mx-auto px-4 py-12">
            <Reveal>
              <h2 className="text-xl font-bold mb-5">دسته‌بندی‌های محبوب</h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[140px] md:auto-rows-[160px]">
              {CATS.map((c, i) => (
                <Reveal key={c.slug} delay={i * 80} className={i === 0 ? 'col-span-2 row-span-2' : ''}>
                  <CategoryTile
                    slug={c.slug}
                    name={c.name}
                    icon={c.icon}
                    featured={i === 0}
                    subtitle={i === 0 ? 'پرطرفدارترین دسته این هفته' : undefined}
                  />
                </Reveal>
              ))}
            </div>
          </section>

          {/* آمار متحرک */}
          <section className="max-w-7xl mx-auto px-4 pb-4">
            <Reveal>
              <div className="bg-[var(--color-ink)] rounded-3xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                {STATS.map((s) => (
                  <div key={s.label}>
                    <div className="text-3xl md:text-4xl font-black text-white price">
                      <CountUp end={s.value} suffix={s.suffix} />
                    </div>
                    <div className="text-white/50 text-xs md:text-sm mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </section>
        </>
      )}

      {!isHome && (
        <section className="max-w-7xl mx-auto px-4 pt-8">
          <div className="bg-white rounded-2xl border border-[var(--color-line)] shadow-layered p-4 flex gap-3 overflow-x-auto">
            {CATS.map((c) => (
              <Link
                key={c.slug}
                href={`/?category=${c.slug}`}
                className={`shrink-0 flex flex-col items-center gap-1 px-5 py-3 rounded-xl hover:bg-[var(--color-paper)] transition-colors ${category === c.slug ? 'bg-[var(--color-paper)] ring-1 ring-[var(--color-brand)]' : ''}`}
              >
                <span className="text-2xl">{c.icon}</span>
                <span className="text-xs font-medium">{c.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="products" className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">
            {q ? `نتایج جستجو برای «${q}»` : category ? CATS.find((c) => c.slug === category)?.name : 'محصولات پرفروش'}
          </h2>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="text-sm border border-[var(--color-line)] rounded-xl px-3 py-2 bg-white"
          >
            <option value="">جدیدترین</option>
            <option value="price_asc">ارزان‌ترین</option>
            <option value="price_desc">گران‌ترین</option>
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-[var(--color-line)] overflow-hidden">
                <div className="aspect-square animate-shimmer" />
                <div className="p-3 flex flex-col gap-2">
                  <div className="h-3 rounded animate-shimmer w-full" />
                  <div className="h-3 rounded animate-shimmer w-2/3" />
                  <div className="h-4 rounded animate-shimmer w-1/2 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">محصولی پیدا نشد.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => (
              <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${(i % 8) * 60}ms` }}>
                <ProductCard product={p} onQuickView={setQuickViewProduct} />
              </div>
            ))}
          </div>
        )}
      </section>
      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">در حال بارگذاری...</div>}>
      <HomeContent />
    </Suspense>
  );
}
