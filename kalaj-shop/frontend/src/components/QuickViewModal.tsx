'use client';
import Link from 'next/link';
import { X, ShoppingCart } from 'lucide-react';
import { toman } from '@/lib/api';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '');

export default function QuickViewModal({ product, onClose }: { product: any; onClose: () => void }) {
  const { addItem, openDrawer } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { show } = useToast();

  if (!product) return null;

  let firstImage: string | null = null;
  try { firstImage = (product.images ? JSON.parse(product.images) : [])[0] || null; } catch {}

  async function handleAdd() {
    if (!user) return router.push('/login');
    await addItem(product.id, 1);
    show(`«${product.title}» به سبد اضافه شد`, 'success');
    onClose();
    setTimeout(() => openDrawer(), 200);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-[98] flex items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1c1730] rounded-3xl max-w-2xl w-full grid md:grid-cols-2 overflow-hidden shadow-2xl animate-scale-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 left-3 z-10 bg-white/90 p-2 rounded-xl hover:bg-white"><X size={16} /></button>
        <div className="aspect-square bg-gradient-to-br from-[var(--color-paper)] to-[var(--color-coral-soft)] flex items-center justify-center text-7xl overflow-hidden">
          {firstImage ? <img src={`${API_BASE}${firstImage}`} alt={product.title} className="w-full h-full object-cover" /> : '🛍️'}
        </div>
        <div className="p-6 flex flex-col">
          <p className="text-sm text-[var(--color-brand)] font-medium mb-2">{product.category?.name}</p>
          <h2 className="text-xl font-bold mb-3">{product.title}</h2>
          <p className="text-sm text-gray-500 line-clamp-3 mb-4 leading-6">{product.description}</p>
          <div className="flex items-baseline gap-2 mb-6">
            {product.compareAt && <span className="text-gray-400 line-through price text-sm">{toman(product.compareAt)}</span>}
            <span className="text-2xl font-black price text-[var(--color-brand-deep)]">{toman(product.price)}</span>
          </div>
          <button onClick={handleAdd} disabled={product.stock === 0}
            className="flex items-center justify-center gap-2 bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl hover:bg-[var(--color-brand-deep)] disabled:opacity-50 mb-2">
            <ShoppingCart size={16} /> {product.stock === 0 ? 'ناموجود' : 'افزودن به سبد'}
          </button>
          <Link href={`/product/${product.slug}`} className="text-center text-sm text-gray-400 hover:text-[var(--color-brand)] py-2">
            مشاهده جزئیات کامل
          </Link>
        </div>
      </div>
    </div>
  );
}
