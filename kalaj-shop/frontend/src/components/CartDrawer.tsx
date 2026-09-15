'use client';
import Link from 'next/link';
import { useCart } from '@/store/cart';
import { toman } from '@/lib/api';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace('/api', '');

export default function CartDrawer() {
  const { items, drawerOpen, closeDrawer, updateItem, removeItem, subtotal } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/40 z-[90] transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
      />
      <div
        className={`fixed top-0 bottom-0 left-0 w-full max-w-sm bg-white dark:bg-[#1c1730] z-[95] shadow-2xl transition-transform duration-300 flex flex-col ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-[var(--color-line)]">
          <h2 className="font-bold flex items-center gap-2"><ShoppingBag size={18} /> سبد خرید</h2>
          <button onClick={closeDrawer} className="p-2 rounded-xl hover:bg-[var(--color-paper)]"><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {items.length === 0 ? (
            <div className="text-center text-gray-400 py-16 text-sm">سبد خرید شما خالی است.</div>
          ) : (
            items.map((item) => {
              let img: string | null = null;
              try { img = JSON.parse((item.product as any).images || '[]')[0] || null; } catch {}
              return (
                <div key={item.id} className="flex items-center gap-3 border-b border-[var(--color-line)] pb-3">
                  <div className="w-14 h-14 rounded-xl bg-[var(--color-paper)] overflow-hidden shrink-0 flex items-center justify-center text-xl">
                    {img ? <img src={`${API_BASE}${img}`} className="w-full h-full object-cover" alt="" /> : '🛍️'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.product.title}</div>
                    <div className="text-xs text-gray-400 price mt-0.5">{toman(item.product.price)}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => updateItem(item.id, item.quantity + 1)} className="p-1 rounded-lg bg-[var(--color-paper)]"><Plus size={12} /></button>
                      <span className="text-xs w-4 text-center">{item.quantity}</span>
                      <button onClick={() => item.quantity > 1 ? updateItem(item.id, item.quantity - 1) : removeItem(item.id)} className="p-1 rounded-lg bg-[var(--color-paper)]"><Minus size={12} /></button>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg shrink-0"><Trash2 size={14} /></button>
                </div>
              );
            })
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t border-[var(--color-line)]">
            <div className="flex justify-between text-sm mb-3">
              <span>جمع کل</span>
              <span className="font-bold price">{toman(subtotal())}</span>
            </div>
            <Link href="/checkout" onClick={closeDrawer} className="block text-center bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl hover:bg-[var(--color-brand-deep)] transition-colors">
              ادامه فرآیند خرید
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
