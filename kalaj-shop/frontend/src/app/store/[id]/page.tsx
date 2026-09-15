'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import Reveal from '@/components/Reveal';
import { Store, Star, Package, Calendar } from 'lucide-react';

export default function StorePage() {
  const { id } = useParams<{ id: string }>();
  const [store, setStore] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  useEffect(() => {
    api.get(`/store/${id}`).then(({ data }) => setStore(data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="h-40 rounded-3xl animate-shimmer mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square rounded-2xl animate-shimmer" />)}
        </div>
      </div>
    );
  }

  if (!store) {
    return <div className="text-center py-24 text-gray-400">فروشگاه پیدا نشد.</div>;
  }

  return (
    <div>
      <section className="brand-gradient text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 40%, white 1px, transparent 1px), radial-gradient(circle at 80% 60%, white 1px, transparent 1px)', backgroundSize: '55px 55px' }} />
        <div className="max-w-6xl mx-auto px-4 py-14 relative">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center text-3xl shrink-0">
              <Store size={30} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">{store.storeName}</h1>
              {store.description && <p className="text-white/70 text-sm mt-1">{store.description}</p>}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
              <Package size={14} /> {store.productCount} محصول
            </span>
            {store.avgRating && (
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
                <Star size={14} fill="currentColor" /> {store.avgRating.toFixed(1)} ({store.reviewCount} نظر)
              </span>
            )}
            <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur">
              <Calendar size={14} /> عضو از {new Date(store.createdAt).toLocaleDateString('fa-IR')}
            </span>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-10">
        <Reveal>
          <h2 className="font-bold text-lg mb-5">محصولات فروشگاه</h2>
        </Reveal>
        {store.products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">این فروشگاه هنوز محصولی ندارد.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {store.products.map((p: any) => (
              <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </div>
      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
}
