'use client';
import { useEffect, useState, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';

const CAT_NAMES: Record<string, string> = {
  mobile: 'موبایل',
  laptop: 'لپ‌تاپ',
  accessories: 'لوازم جانبی',
  fashion: 'پوشاک',
};

function CategoryContent() {
  const { slug } = useParams<{ slug: string }>();
  const params = useSearchParams();
  const q = params.get('q') || '';
  const [products, setProducts] = useState<any[]>([]);
  const [sort, setSort] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  useEffect(() => {
    setLoading(true);
    const query: any = { category: slug };
    if (q) query.q = q;
    if (sort) query.sort = sort;
    if (minPrice) query.minPrice = minPrice;
    if (maxPrice) query.maxPrice = maxPrice;
    api.get('/products', { params: query }).then(({ data }) => setProducts(data)).finally(() => setLoading(false));
  }, [slug, q, sort, minPrice, maxPrice]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">{CAT_NAMES[slug] || slug}</h1>
      <div className="grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="bg-white border border-[var(--color-line)] rounded-2xl p-4 h-fit sticky top-24">
          <h3 className="font-bold text-sm mb-3">فیلتر قیمت (تومان)</h3>
          <div className="flex flex-col gap-2 mb-4">
            <input type="number" placeholder="حداقل" value={minPrice} onChange={(e) => setMinPrice(e.target.value)}
              className="border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm" />
            <input type="number" placeholder="حداکثر" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm" />
          </div>
          <h3 className="font-bold text-sm mb-3">مرتب‌سازی</h3>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="w-full border border-[var(--color-line)] rounded-lg px-3 py-2 text-sm">
            <option value="">جدیدترین</option>
            <option value="price_asc">ارزان‌ترین</option>
            <option value="price_desc">گران‌ترین</option>
          </select>
        </aside>

        <div>
          {loading ? (
            <div className="text-center py-20 text-gray-400">در حال بارگذاری...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 text-gray-400">محصولی در این دسته پیدا نشد.</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQuickViewProduct} />)}
            </div>
          )}
        </div>
      </div>
      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-gray-400">در حال بارگذاری...</div>}>
      <CategoryContent />
    </Suspense>
  );
}
