'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import Reveal from '@/components/Reveal';
import { Calendar, User, ArrowLeft, Clock } from 'lucide-react';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '');

function readingTime(text: string) {
  const words = text?.trim().split(/\s+/).length || 0;
  return Math.max(1, Math.round(words / 120));
}

export default function BlogPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCat, setActiveCat] = useState('همه');

  useEffect(() => {
    api.get('/posts').then(({ data }) => setPosts(data)).finally(() => setLoading(false));
  }, []);

  const categories = useMemo(() => ['همه', ...Array.from(new Set(posts.map((p) => p.category)))], [posts]);
  const filtered = activeCat === 'همه' ? posts : posts.filter((p) => p.category === activeCat);
  const [featured, ...rest] = filtered;

  return (
    <div>
      {/* هدر مجله */}
      <section className="brand-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 15% 40%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="max-w-6xl mx-auto px-4 py-16 text-center relative">
          <span className="inline-block text-xs font-bold bg-white/15 px-3 py-1.5 rounded-full mb-4 backdrop-blur">📰 مجله کالاژ</span>
          <h1 className="text-3xl md:text-5xl font-black mb-3 tracking-tight">راهنما، ترفند و الهام خرید</h1>
          <p className="text-white/80 max-w-lg mx-auto text-lg">راهنمای خرید، ترفندهای کاربردی و اخبار دنیای تکنولوژی و مد، هفته‌ای چند بار</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* فیلتر دسته‌بندی */}
        {categories.length > 1 && (
          <div className="flex gap-2 mb-10 overflow-x-auto pb-1">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  activeCat === c ? 'bg-[var(--color-brand)] text-white' : 'bg-white border border-[var(--color-line)] text-gray-500 hover:border-[var(--color-brand)]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <div key={i} className="h-80 rounded-3xl animate-shimmer" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">مقاله‌ای در این دسته پیدا نشد.</div>
        ) : (
          <>
            {/* مقاله ویژه بزرگ */}
            {featured && (
              <Reveal>
                <Link href={`/blog/${featured.slug}`} className="group grid md:grid-cols-2 gap-0 bg-white border border-[var(--color-line)] rounded-3xl overflow-hidden hover:shadow-layered-lg transition-all duration-300 mb-10">
                  <div className="aspect-video md:aspect-auto bg-gradient-to-br from-[var(--color-paper)] to-[var(--color-coral-soft)] flex items-center justify-center text-7xl overflow-hidden">
                    {featured.coverImage ? (
                      <img src={`${API_BASE}${featured.coverImage}`} alt={featured.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : '📰'}
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <span className="text-xs font-bold text-[var(--color-brand)] bg-[var(--color-brand)]/10 px-3 py-1.5 rounded-full w-fit mb-4">
                      {featured.category}
                    </span>
                    <h2 className="text-2xl font-black mb-3 leading-snug group-hover:text-[var(--color-brand)] transition-colors">{featured.title}</h2>
                    <p className="text-gray-500 mb-5 leading-7 line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                      <span className="flex items-center gap-1"><User size={13} /> {featured.authorName}</span>
                      <span className="flex items-center gap-1"><Calendar size={13} /> {new Date(featured.createdAt).toLocaleDateString('fa-IR')}</span>
                      <span className="flex items-center gap-1"><Clock size={13} /> {readingTime(featured.content)} دقیقه مطالعه</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-sm font-bold text-[var(--color-brand)] w-fit group-hover:gap-2 transition-all">
                      ادامه مطلب <ArrowLeft size={16} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )}

            {/* بقیه مقاله‌ها */}
            <div className="grid md:grid-cols-3 gap-6">
              {rest.map((p, i) => (
                <Reveal key={p.id} delay={i * 60}>
                  <Link href={`/blog/${p.slug}`}
                    className="group bg-white border border-[var(--color-line)] rounded-2xl overflow-hidden hover:shadow-layered-lg hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col">
                    <div className="aspect-video bg-gradient-to-br from-[var(--color-paper)] to-[var(--color-coral-soft)] flex items-center justify-center text-5xl overflow-hidden">
                      {p.coverImage ? <img src={`${API_BASE}${p.coverImage}`} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" /> : '📰'}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <span className="text-xs font-bold text-[var(--color-brand)] bg-[var(--color-brand)]/10 px-2.5 py-1 rounded-full w-fit">{p.category}</span>
                      <h2 className="font-bold mt-3 mb-2 group-hover:text-[var(--color-brand)] transition-colors leading-snug">{p.title}</h2>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3 flex-1">{p.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400 pt-3 border-t border-[var(--color-line)]">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(p.createdAt).toLocaleDateString('fa-IR')}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {readingTime(p.content)} دقیقه</span>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
