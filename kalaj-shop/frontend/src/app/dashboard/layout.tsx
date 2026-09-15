'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/store/auth';
import { User, Package, ShoppingBag, MapPin, Heart, Settings, LayoutDashboard, Tag, Newspaper, Layers, MessageCircle } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, hydrate, hydrated } = useAuth();
  const pathname = usePathname();

  useEffect(() => { hydrate(); }, [hydrate]);

  const customerLinks = [
    { href: '/dashboard', label: 'خلاصه حساب', icon: LayoutDashboard },
    { href: '/dashboard/orders', label: 'سفارش‌های من', icon: ShoppingBag },
    { href: '/dashboard/addresses', label: 'آدرس‌ها', icon: MapPin },
    { href: '/wishlist', label: 'علاقه‌مندی‌ها', icon: Heart },
    { href: '/dashboard/profile', label: 'تنظیمات پروفایل', icon: Settings },
  ];

  const sellerLinks = [
    { href: '/dashboard/seller', label: 'داشبورد فروشنده', icon: LayoutDashboard },
    { href: '/dashboard/seller/products', label: 'محصولات من', icon: Package },
    { href: '/dashboard/seller/orders', label: 'سفارش‌های دریافتی', icon: ShoppingBag },
    { href: '/dashboard/orders', label: 'سفارش‌های خرید من', icon: Tag },
    { href: '/dashboard/profile', label: 'تنظیمات پروفایل', icon: Settings },
  ];

  const adminLinks = [
    { href: '/dashboard/admin', label: 'داشبورد ادمین', icon: LayoutDashboard },
    { href: '/dashboard/admin/users', label: 'مدیریت کاربران', icon: User },
    { href: '/dashboard/admin/orders', label: 'مدیریت سفارش‌ها', icon: ShoppingBag },
    { href: '/dashboard/admin/support', label: 'پشتیبانی', icon: MessageCircle },
    { href: '/dashboard/admin/categories', label: 'دسته‌بندی‌ها', icon: Layers },
    { href: '/dashboard/admin/blog', label: 'مدیریت وبلاگ', icon: Newspaper },
    { href: '/dashboard/admin/settings', label: 'تنظیمات سایت', icon: Settings },
    { href: '/dashboard/profile', label: 'تنظیمات پروفایل', icon: User },
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : user?.role === 'SELLER' ? sellerLinks : customerLinks;

  if (hydrated && !user) {
    return (
      <div className="max-w-md mx-auto text-center py-24">
        <p className="mb-4 text-gray-500">برای دسترسی به داشبورد وارد شوید.</p>
        <Link href="/login" className="bg-[var(--color-brand)] text-white px-6 py-3 rounded-xl font-bold">ورود</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 grid md:grid-cols-[220px_1fr] gap-6">
      <aside className="hidden md:block">
        <div className="bg-white border border-[var(--color-line)] rounded-2xl p-3 sticky top-24">
          <div className="px-3 py-3 mb-2 border-b border-[var(--color-line)]">
            <div className="font-bold text-sm">{user?.name}</div>
            <div className="text-xs text-gray-400">
              {user?.role === 'ADMIN' ? 'ادمین سایت' : user?.role === 'SELLER' ? 'حساب فروشندگی' : 'حساب مشتری'}
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            {links.map((l) => {
              const active = pathname === l.href;
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active ? 'bg-[var(--color-brand)] text-white' : 'hover:bg-[var(--color-paper)] text-gray-600'
                  }`}
                >
                  <l.icon size={17} /> {l.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* منوی افقی موبایل */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {links.map((l) => {
          const active = pathname === l.href;
          return (
            <Link key={l.href} href={l.href}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium ${active ? 'bg-[var(--color-brand)] text-white' : 'bg-white border border-[var(--color-line)] text-gray-600'}`}>
              <l.icon size={14} /> {l.label}
            </Link>
          );
        })}
      </div>

      <div>{children}</div>
    </div>
  );
}
