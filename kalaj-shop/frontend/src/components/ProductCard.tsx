'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toman } from '@/lib/api';
import api from '@/lib/api';
import { ShoppingCart, Check, Eye, Heart } from 'lucide-react';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import Tilt from '@/components/Tilt';

const EMOJIS: Record<string, string> = {
  mobile: '📱',
  laptop: '💻',
  accessories: '🎧',
  fashion: '👕',
};
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '');

export default function ProductCard({ product, onQuickView }: { product: any; onQuickView?: (p: any) => void }) {
  const { addItem, openDrawer } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { show } = useToast();
  const [added, setAdded] = useState(false);
  const [wished, setWished] = useState(false);
  const discount = product.compareAt ? Math.round(100 - (product.price / product.compareAt) * 100) : 0;
  const isNew = product.createdAt && (Date.now() - new Date(product.createdAt).getTime()) < 1000 * 60 * 60 * 24 * 14;
  const lowStock = product.stock > 0 && product.stock <= 5;
  const emoji = EMOJIS[product.category?.slug] || '🛍️';
  let firstImage: string | null = null;
  try {
    const imgs = product.images ? JSON.parse(product.images) : [];
    firstImage = imgs[0] || null;
  } catch {}

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) return router.push('/login');
    await addItem(product.id, 1);
    setAdded(true);
    show(`«${product.title}» به سبد اضافه شد`, 'success');
    setTimeout(() => setAdded(false), 1200);
    setTimeout(() => openDrawer(), 300);
  }

  function handleQuickView(e: React.MouseEvent) {
    e.preventDefault();
    onQuickView?.(product);
  }

  async function handleWish(e: React.MouseEvent) {
    e.preventDefault();
    if (!user) return router.push('/login');
    try {
      if (wished) {
        await api.delete(`/wishlist/${product.id}`);
        setWished(false);
        show('از علاقه‌مندی‌ها حذف شد', 'info');
      } else {
        await api.post(`/wishlist/${product.id}`);
        setWished(true);
        show('به علاقه‌مندی‌ها اضافه شد', 'success');
      }
    } catch {}
  }

  return (
    <Tilt>
    <Link
      href={`/product/${product.slug}`}
      className="group bg-white rounded-2xl border border-[var(--color-line)] overflow-hidden hover:shadow-layered-lg transition-shadow duration-300 flex flex-col"
    >
      <div className="aspect-square bg-gradient-to-br from-[var(--color-paper)] to-[var(--color-coral-soft)] flex items-center justify-center text-6xl relative overflow-hidden">
        {firstImage ? (
          <img src={`${API_BASE}${firstImage}`} alt={product.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : emoji}
        <div className="absolute top-2 right-2 left-2 flex justify-between items-start">
          <div className="flex flex-col gap-1">
            {discount > 0 && (
              <span className="bg-[var(--color-coral)] text-white text-xs font-bold px-2 py-1 rounded-lg w-fit">٪{discount}</span>
            )}
            {isNew && (
              <span className="bg-[var(--color-mint)] text-white text-xs font-bold px-2 py-1 rounded-lg w-fit">جدید</span>
            )}
          </div>
          <button onClick={handleWish} className="p-1.5 rounded-full bg-white/90 hover:bg-white shadow-sm">
            <Heart size={15} className={wished ? 'fill-[var(--color-coral)] text-[var(--color-coral)]' : 'text-gray-400'} />
          </button>
        </div>
        {lowStock && (
          <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-1 rounded-lg">
            فقط {product.stock} عدد باقی مانده
          </span>
        )}
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-white text-[var(--color-ink)] p-2 rounded-xl shadow-layered hover:bg-[var(--color-brand)] hover:text-white"
            title="پیش‌نمایش سریع"
          >
            <Eye size={16} />
          </button>
        )}
      </div>
      <div className="p-3 flex flex-col gap-2 flex-1">
        <h3 className="text-sm font-medium line-clamp-2 min-h-[2.5rem]">{product.title}</h3>
        <div className="mt-auto flex items-end justify-between">
          <div>
            {product.compareAt && (
              <div className="text-xs text-gray-400 line-through price">{toman(product.compareAt)}</div>
            )}
            <div className="font-bold price text-[var(--color-brand-deep)]">{toman(product.price)}</div>
          </div>
          <button
            onClick={handleAdd}
            className={`p-2 rounded-xl transition-all duration-200 ${added ? 'bg-[var(--color-mint)] text-white scale-110' : 'bg-[var(--color-brand)]/10 text-[var(--color-brand-deep)] group-hover:bg-[var(--color-brand)] group-hover:text-white'}`}
            title="افزودن به سبد"
          >
            {added ? <Check size={18} /> : <ShoppingCart size={18} />}
          </button>
        </div>
      </div>
    </Link>
    </Tilt>
  );
}
