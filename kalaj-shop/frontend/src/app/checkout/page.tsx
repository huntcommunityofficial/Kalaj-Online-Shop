'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/store/cart';
import api, { toman } from '@/lib/api';
import { Tag } from 'lucide-react';

export default function Checkout() {
  const { items, fetchCart, subtotal } = useCart();
  const [address, setAddress] = useState('');
  const [code, setCode] = useState('');
  const [discount, setDiscount] = useState<{ amount: number; code: string } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  async function applyCode() {
    setError('');
    try {
      const { data } = await api.post('/discounts/validate', { code, subtotal: subtotal() });
      setDiscount({ amount: data.discountAmount, code: data.code });
    } catch (err: any) {
      setDiscount(null);
      setError(err?.response?.data?.error || 'کد نامعتبر است');
    }
  }

  async function placeOrder() {
    if (!address) return setError('آدرس را وارد کنید');
    setLoading(true);
    setError('');
    try {
      const { data: order } = await api.post('/orders/checkout', { address, discountCode: discount?.code });
      await api.post(`/orders/${order.id}/pay`);
      router.push(`/dashboard/orders`);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'خطا در ثبت سفارش');
    } finally {
      setLoading(false);
    }
  }

  const total = subtotal() - (discount?.amount || 0);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">تسویه حساب</h1>
      <div className="bg-white border border-[var(--color-line)] rounded-2xl p-5 flex flex-col gap-4">
        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{error}</div>}
        <div>
          <label className="text-sm font-medium mb-1 block">آدرس تحویل سفارش</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3}
            placeholder="استان، شهر، خیابان، پلاک..."
            className="w-full border border-[var(--color-line)] rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--color-brand)]" />
        </div>

        <div>
          <label className="text-sm font-medium mb-1 block">کد تخفیف</label>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center border border-[var(--color-line)] rounded-xl px-3">
              <Tag size={16} className="text-gray-400" />
              <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="مثلاً WELCOME10"
                className="flex-1 px-2 py-3 outline-none text-sm" />
            </div>
            <button onClick={applyCode} className="px-4 rounded-xl border border-[var(--color-brand)] text-[var(--color-brand)] font-medium hover:bg-[var(--color-brand)]/10">اعمال</button>
          </div>
          {discount && <div className="text-sm text-[var(--color-mint)] mt-2">کد «{discount.code}» با موفقیت اعمال شد ✓</div>}
        </div>

        <div className="border-t border-[var(--color-line)] pt-4 flex flex-col gap-1 text-sm">
          <div className="flex justify-between"><span>جمع سبد خرید</span><span className="price">{toman(subtotal())}</span></div>
          {discount && <div className="flex justify-between text-[var(--color-mint)]"><span>تخفیف</span><span className="price">- {toman(discount.amount)}</span></div>}
          <div className="flex justify-between font-bold text-base mt-1"><span>مبلغ قابل پرداخت</span><span className="price">{toman(total)}</span></div>
        </div>

        <button onClick={placeOrder} disabled={loading || items.length === 0}
          className="w-full bg-[var(--color-brand)] text-white font-bold py-3 rounded-xl hover:bg-[var(--color-brand-deep)] disabled:opacity-50">
          {loading ? 'در حال پردازش...' : 'پرداخت و ثبت سفارش'}
        </button>
        <p className="text-xs text-gray-400 text-center">این یک درگاه پرداخت آزمایشی است — پرداخت واقعی انجام نمی‌شود.</p>
      </div>
    </div>
  );
}
