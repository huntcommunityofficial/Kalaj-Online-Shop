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

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get('/orders').then(({ data }) => setOrders(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">سفارش‌های من</h1>
      {orders.length === 0 ? (
        <div className="text-center py-20 text-gray-400">هنوز سفارشی ثبت نکرده‌اید.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-white border border-[var(--color-line)] rounded-2xl p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-500">سفارش #{o.id.slice(-6)}</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand-deep)]">
                  {STATUS_FA[o.status] || o.status}
                </span>
              </div>
              <div className="flex flex-col gap-1 text-sm mb-3">
                {o.items.map((i: any) => (
                  <div key={i.id} className="flex justify-between text-gray-600">
                    <span>{i.product?.title} × {i.quantity}</span>
                    <span className="price">{toman(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--color-line)] pt-3 flex justify-between font-bold">
                <span>مبلغ نهایی</span>
                <span className="price">{toman(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
