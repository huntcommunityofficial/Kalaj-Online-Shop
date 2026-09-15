'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/store/auth';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
  const { user, hydrate, hydrated } = useAuth();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (user) {
      api.get('/wishlist').then(({ data }) => setProducts(data)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (hydrated && !user) {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <p className="mb-4 text-gray-500">برای مشاهده علاقه‌مندی‌ها وارد شوید.</p>
        <Link href="/login" className="bg-[var(--color-brand)] text-white px-6 py-3 rounded-xl font-bold">ورود</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2"><Heart size={22} className="text-[var(--color-coral)]" /> علاقه‌مندی‌های من</h1>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-square rounded-2xl animate-shimmer" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          هنوز چیزی به علاقه‌مندی‌ها اضافه نکردی. روی آیکون قلب کنار محصولات بزن!
          <div className="mt-4"><Link href="/" className="text-[var(--color-brand)] font-medium">مشاهده محصولات</Link></div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />)}
        </div>
      )}
      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
}
