'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api, { toman } from '@/lib/api';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { useToast } from '@/contexts/ToastContext';
import { ShoppingCart, Star, Store, ChevronLeft } from 'lucide-react';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '');
const RECENT_KEY = 'recently_viewed';

function trackRecentlyViewed(product: any) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    let list = raw ? JSON.parse(raw) : [];
    list = list.filter((p: any) => p.slug !== product.slug);
    list.unshift({ slug: product.slug, title: product.title, price: product.price, images: product.images });
    list = list.slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {}
}

function getRecentlyViewed(excludeSlug: string) {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return list.filter((p: any) => p.slug !== excludeSlug).slice(0, 4);
  } catch {
    return [];
  }
}

export default function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [recent, setRecent] = useState<any[]>([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const { addItem } = useCart();
  const { user, hydrate } = useAuth();
  const { show } = useToast();
  const router = useRouter();

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data);
      trackRecentlyViewed(data);
      setRecent(getRecentlyViewed(slug as string));
    });
  }, [slug]);

  if (!product) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        <div className="aspect-square rounded-3xl animate-shimmer" />
        <div className="flex flex-col gap-3">
          <div className="h-4 w-24 rounded animate-shimmer" />
          <div className="h-8 w-3/4 rounded animate-shimmer" />
          <div className="h-24 rounded animate-shimmer" />
        </div>
      </div>
    );
  }

  let productImages: string[] = [];
  try { productImages = product.images ? JSON.parse(product.images) : []; } catch {}

  const avgRating = product.reviews?.length
    ? (product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length).toFixed(1)
    : null;

  async function handleAdd() {
    if (!user) return router.push('/login');
    await addItem(product.id, 1);
    show(`«${product.title}» به سبد اضافه شد`, 'success');
  }

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return router.push('/login');
    setSubmitting(true);
    try {
      const { data } = await api.post(`/products/${product.id}/reviews`, reviewForm);
      setProduct({ ...product, reviews: [...(product.reviews || []), data] });
      setReviewForm({ rating: 5, comment: '' });
      show('نظر شما ثبت شد ✓', 'success');
    } catch (err: any) {
      show(err?.response?.data?.error || 'خطا در ثبت نظر', 'error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="max-w-5xl mx-auto px-4 py-10 grid md:grid-cols-2 gap-10">
        <div>
          <div className="aspect-square bg-gradient-to-br from-[var(--color-paper)] to-[var(--color-coral-soft)] rounded-3xl flex items-center justify-center text-9xl overflow-hidden group">
            {productImages[activeImg] ? (
              <img src={`${API_BASE}${productImages[activeImg]}`} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            ) : '🛍️'}
          </div>
          {productImages.length > 1 && (
            <div className="flex gap-2 mt-3">
              {productImages.map((img: string, i: number) => (
                <button key={img} onClick={() => setActiveImg(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${activeImg === i ? 'border-[var(--color-brand)] scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={`${API_BASE}${img}`} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="animate-fade-up">
          <p className="text-sm text-[var(--color-brand)] font-medium mb-2">{product.category?.name}</p>
          <h1 className="text-2xl font-bold mb-3">{product.title}</h1>
          {avgRating && (
            <div className="flex items-center gap-1 text-sm text-amber-500 mb-4">
              <Star size={16} fill="currentColor" /> {avgRating} ({product.reviews.length} نظر)
            </div>
          )}
          <div className="flex items-baseline gap-3 mb-4">
            {product.compareAt && <span className="text-gray-400 line-through price text-sm">{toman(product.compareAt)}</span>}
            <span className="text-3xl font-black price text-[var(--color-brand-deep)]">{toman(product.price)}</span>
          </div>
          <p className="text-gray-600 leading-7 mb-6">{product.description}</p>

          {product.seller && (
            <Link href={`/store/${product.seller.id}`} className="flex items-center gap-2 text-sm mb-5 bg-[var(--color-paper)] w-fit px-4 py-2.5 rounded-xl hover:bg-[var(--color-brand)]/10 transition-colors group">
              <Store size={16} className="text-[var(--color-brand)]" />
              <span>فروشنده: <b>{product.seller.storeName}</b></span>
              <ChevronLeft size={14} className="text-gray-400 group-hover:-translate-x-1 transition-transform" />
            </Link>
          )}

          <button onClick={handleAdd} disabled={product.stock === 0}
            className="flex items-center gap-2 bg-[var(--color-brand)] text-white font-bold px-6 py-3 rounded-xl hover:bg-[var(--color-brand-deep)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
            <ShoppingCart size={18} /> {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد خرید'}
          </button>
          <p className="text-xs text-gray-400 mt-3">موجودی: {product.stock} عدد</p>

          {/* فرم ثبت نظر */}
          <div className="mt-10 border-t border-[var(--color-line)] pt-6">
            <h2 className="font-bold mb-3">نظر شما چیه؟</h2>
            <form onSubmit={submitReview} className="bg-white border border-[var(--color-line)] rounded-2xl p-4 flex flex-col gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setReviewForm({ ...reviewForm, rating: n })}>
                    <Star size={22} className={n <= reviewForm.rating ? 'text-amber-500' : 'text-gray-200'} fill={n <= reviewForm.rating ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
              <textarea value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="نظرت رو درباره این محصول بنویس..." rows={2}
                className="border border-[var(--color-line)] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
              <button disabled={submitting} className="bg-[var(--color-brand)] text-white text-sm font-bold py-2.5 rounded-xl w-fit px-6 self-end hover:bg-[var(--color-brand-deep)] disabled:opacity-50">
                {submitting ? 'در حال ارسال...' : 'ثبت نظر'}
              </button>
            </form>
          </div>

          {product.reviews?.length > 0 && (
            <div className="mt-6">
              <div className="flex flex-col gap-3">
                {product.reviews.map((r: any) => (
                  <div key={r.id} className="border border-[var(--color-line)] rounded-xl p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium flex items-center gap-1.5">
                        {r.user?.name}
                        <span className="text-[10px] bg-green-50 text-[var(--color-mint)] px-1.5 py-0.5 rounded-full font-bold">خریدار</span>
                      </span>
                      <span className="text-amber-500 flex items-center gap-1"><Star size={14} fill="currentColor" /> {r.rating}</span>
                    </div>
                    {r.comment && <p className="text-sm text-gray-600 mt-1">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* بازدیدهای اخیر */}
      {recent.length > 0 && (
        <section className="bg-white border-t border-[var(--color-line)] py-10">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="font-bold text-lg mb-5">بازدیدهای اخیر شما</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {recent.map((p: any) => {
                let img: string | null = null;
                try { img = JSON.parse(p.images || '[]')[0] || null; } catch {}
                return (
                  <Link key={p.slug} href={`/product/${p.slug}`} className="group bg-[var(--color-paper)] rounded-2xl overflow-hidden hover:shadow-layered transition-all">
                    <div className="aspect-square flex items-center justify-center text-3xl overflow-hidden bg-white">
                      {img ? <img src={`${API_BASE}${img}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" /> : '🛍️'}
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-medium line-clamp-2 mb-1">{p.title}</h3>
                      <div className="text-xs font-bold text-[var(--color-brand-deep)] price">{toman(p.price)}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
