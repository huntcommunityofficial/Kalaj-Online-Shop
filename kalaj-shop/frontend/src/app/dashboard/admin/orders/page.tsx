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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    api.get('/admin/orders').then(({ data }) => setOrders(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">همه سفارش‌های سایت</h1>
      <div className="bg-white border border-[var(--color-line)] rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-[var(--color-paper)] text-gray-500">
            <tr>
              <th className="text-right px-4 py-3 font-medium">شماره سفارش</th>
              <th className="text-right px-4 py-3 font-medium">مشتری</th>
              <th className="text-right px-4 py-3 font-medium">مبلغ</th>
              <th className="text-right px-4 py-3 font-medium">وضعیت</th>
              <th className="text-right px-4 py-3 font-medium">تاریخ</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t border-[var(--color-line)]">
                <td className="px-4 py-3 font-mono">#{o.id.slice(-6)}</td>
                <td className="px-4 py-3">{o.user?.name}</td>
                <td className="px-4 py-3 price">{toman(o.total)}</td>
                <td className="px-4 py-3">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand-deep)]">
                    {STATUS_FA[o.status] || o.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{new Date(o.createdAt).toLocaleDateString('fa-IR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
