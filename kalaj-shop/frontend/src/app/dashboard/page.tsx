'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api, { toman } from '@/lib/api';
import { useAuth } from '@/store/auth';
import { ShoppingBag, Heart, MapPin, Clock } from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user?.role === 'CUSTOMER') {
      api.get('/orders').then(({ data }) => setOrders(data));
    }
  }, [user]);

  const totalSpent = orders.reduce((s, o) => s + o.total, 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">خوش اومدی، {user?.name} 👋</h1>
      <p className="text-gray-500 text-sm mb-6">خلاصه‌ای از فعالیت‌های اخیر حسابت اینجاست.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<ShoppingBag size={20} />} label="تعداد سفارش‌ها" value={orders.length} />
        <StatCard icon={<Clock size={20} />} label="مجموع خرید" value={toman(totalSpent)} />
        <StatCard icon={<Heart size={20} />} label="علاقه‌مندی‌ها" value="۰" />
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">آخرین سفارش‌ها</h2>
        <Link href="/dashboard/orders" className="text-sm text-[var(--color-brand)] font-medium">مشاهده همه</Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white border border-[var(--color-line)] rounded-2xl p-10 text-center text-gray-400 text-sm">
          هنوز سفارشی ثبت نکرده‌اید.
          <div className="mt-3"><Link href="/" className="text-[var(--color-brand)] font-medium">شروع خرید</Link></div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.slice(0, 3).map((o) => (
            <div key={o.id} className="bg-white border border-[var(--color-line)] rounded-2xl p-4 flex justify-between items-center">
              <div>
                <div className="text-sm font-medium">سفارش #{o.id.slice(-6)}</div>
                <div className="text-xs text-gray-400">{o.items.length} کالا</div>
              </div>
              <div className="font-bold price text-sm">{toman(o.total)}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value }: any) {
  return (
    <div className="bg-white border border-[var(--color-line)] rounded-2xl p-4 flex items-center gap-3">
      <div className="p-2 rounded-xl bg-[var(--color-brand)]/10 text-[var(--color-brand-deep)]">{icon}</div>
      <div>
        <div className="text-xs text-gray-500">{label}</div>
        <div className="font-bold price">{value}</div>
      </div>
    </div>
  );
}
