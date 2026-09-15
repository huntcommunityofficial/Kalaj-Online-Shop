'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import { useAuth } from '@/store/auth';
import { toman } from '@/lib/api';
import { Trash2, Plus, Minus } from 'lucide-react';

const FREE_SHIPPING_THRESHOLD = 500000;

function FreeShippingBar({ amount }: { amount: number }) {
  const remaining = FREE_SHIPPING_THRESHOLD - amount;
  const pct = Math.min(100, (amount / FREE_SHIPPING_THRESHOLD) * 100);
  return (
    <div>
      <div className="text-xs font-medium mb-2">
        {remaining > 0 ? (
          <>🚚 <span className="text-[var(--color-brand-deep)] font-bold">{toman(remaining)}</span> دیگه بخر تا ارسال رایگان بشه!</>
        ) : (
          <span className="text-[var(--color-mint)] font-bold">🎉 ارسال این سفارش رایگانه!</span>
        )}
      </div>
      <div className="h-2 bg-[var(--color-paper)] rounded-full overflow-hidden">
        <div className="h-full brand-gradient transition-all duration-500 rounded-full" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function CartPage() {
  const { items, fetchCart, updateItem, removeItem, subtotal } = useCart();
  const { user, hydrated, hydrate } = useAuth();
  const router = useRouter();

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { if (user) fetchCart(); }, [user, fetchCart]);

  if (hydrated && !user) {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <p className="mb-4 text-gray-500">برای مشاهده سبد خرید وارد شوید.</p>
        <Link href="/login" className="bg-[var(--color-brand)] text-white px-6 py-3 rounded-xl font-bold">ورود</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">سبد خرید</h1>
      {items.length === 0 ? (
        <div className="text-center py-20 text-gray-400">سبد خرید شما خالی است.</div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id} className="bg-white border border-[var(--color-line)] rounded-2xl p-4 flex items-center gap-4">
                <div className="w-16 h-16 bg-[var(--color-paper)] rounded-xl flex items-center justify-center text-2xl shrink-0">🛍️</div>
                <div className="flex-1">
                  <Link href={`/product/${item.product.slug}`} className="font-medium hover:text-[var(--color-brand)]">{item.product.title}</Link>
                  <div className="text-sm text-gray-500 price mt-1">{toman(item.product.price)}</div>
                </div>
                <div className="flex items-center gap-2 border border-[var(--color-line)] rounded-xl">
                  <button onClick={() => updateItem(item.id, item.quantity + 1)} className="p-2 hover:bg-[var(--color-paper)] rounded-xl"><Plus size={14} /></button>
                  <span className="w-6 text-center text-sm">{item.quantity}</span>
                  <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)} className="p-2 hover:bg-[var(--color-paper)] rounded-xl"><Minus size={14} /></button>
                </div>
                <button onClick={() => removeItem(item.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
          <div className="bg-white border border-[var(--color-line)] rounded-2xl p-5 h-fit sticky top-24">
            <FreeShippingBar amount={subtotal()} />
            <div className="flex justify-between text-sm mb-2 mt-4">
              <span>جمع کل</span>
              <span className="price font-bold">{toman(subtotal())}</span>
            </div>
            <button onClick={() => router.push('/checkout')} className="w-full bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl mt-3 hover:bg-[var(--color-brand-deep)]">
              ادامه فرآیند خرید
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
