'use client';
import { useEffect, useState } from 'react';
import api, { toman } from '@/lib/api';

const STATUS_FA: Record<string, string> = {
  PENDING_PAYMENT: 'در انتظار پرداخت',
  PAID: 'پرداخت‌شده',
  PROCESSING: 'در حال آماده‌سازی',
  SHIPPED: 'ارسال‌شده',
  DELIVERED: 'تحویل داده‌شده',
  CANCELLED: 'لغوشده',
  RETURNED: 'مرجوعی',
};
const NEXT_STATUS: Record<string, string> = {
  PAID: 'PROCESSING',
  PROCESSING: 'SHIPPED',
  SHIPPED: 'DELIVERED',
};

export default function SellerOrdersPage() {
  const [items, setItems] = useState<any[]>([]);

  function load() {
    api.get('/seller/orders').then(({ data }) => setItems(data));
  }
  useEffect(load, []);

  async function advance(orderId: string, current: string) {
    const next = NEXT_STATUS[current];
    if (!next) return;
    await api.put(`/orders/${orderId}/status`, { status: next });
    load();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">سفارش‌های دریافتی</h1>
      {items.length === 0 ? (
        <div className="bg-white border border-[var(--color-line)] rounded-2xl p-10 text-center text-gray-400 text-sm">
          هنوز سفارشی برای محصولات شما ثبت نشده است.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((i) => (
            <div key={i.id} className="bg-white border border-[var(--color-line)] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="font-medium text-sm">{i.product?.title} × {i.quantity}</div>
                <div className="text-xs text-gray-400">خریدار: {i.order?.user?.name} · سفارش #{i.orderId.slice(-6)}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold price text-sm">{toman(i.price * i.quantity)}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand-deep)]">
                  {STATUS_FA[i.order?.status] || i.order?.status}
                </span>
                {NEXT_STATUS[i.order?.status] && (
                  <button onClick={() => advance(i.orderId, i.order.status)} className="text-xs font-bold px-3 py-1.5 rounded-xl bg-[var(--color-brand)] text-white">
                    تغییر به «{STATUS_FA[NEXT_STATUS[i.order.status]]}»
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
