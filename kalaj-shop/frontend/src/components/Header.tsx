'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { ShoppingCart, Search, User, LayoutDashboard, LogOut, Menu, ChevronDown, Heart, Sun, Moon } from 'lucide-react';
import { useAuth } from '@/store/auth';
import { useCart } from '@/store/cart';
import { useTheme } from '@/contexts/ThemeContext';
import { useRouter } from 'next/navigation';
import api, { toman } from '@/lib/api';

const CATS = [
  { slug: 'mobile', name: 'موبایل', icon: '📱', items: ['شیائومی', 'سامسونگ', 'اپل', 'لوازم جانبی موبایل'] },
  { slug: 'laptop', name: 'لپ‌تاپ', icon: '💻', items: ['ایسوس', 'لنوو', 'اپل مک‌بوک', 'گیمینگ'] },
  { slug: 'accessories', name: 'لوازم جانبی', icon: '🎧', items: ['هدفون', 'پاوربانک', 'کابل و شارژر', 'ساعت هوشمند'] },
  { slug: 'fashion', name: 'پوشاک', icon: '👕', items: ['مردانه', 'زنانه', 'بچگانه', 'کفش'] },
];

const MORE_LINKS = [
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' },
  { href: '/faq', label: 'سوالات متداول' },
  { href: '/terms', label: 'قوانین و مقررات' },
];

export default function Header() {
  const { user, hydrate, hydrated, logout } = useAuth();
  const { count, fetchCart, openDrawer } = useCart();
  const { dark, toggle } = useTheme();
  const [announcement, setAnnouncement] = useState('🚚 ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان — تا پایان هفته');
  const [moreOpen, setMoreOpen] = useState(false);
  const [q, setQ] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [openCat, setOpenCat] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => { if (user) fetchCart(); }, [user, fetchCart]);
  useEffect(() => {
    api.get('/settings').then(({ data }) => { if (data.announcement) setAnnouncement(data.announcement); }).catch(() => {});
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    setShowSuggest(false);
    router.push(`/?q=${encodeURIComponent(q)}`);
  }

  function onSearchChange(val: string) {
    setQ(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggest(false);
      return;
    }
    debounceRef.current = setTimeout(() => {
      api.get('/products', { params: { q: val } }).then(({ data }) => {
        setSuggestions(data.slice(0, 5));
        setShowSuggest(true);
      });
    }, 300);
  }

  function openMenu(slug: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenCat(slug);
  }
  function scheduleClose() {
    closeTimer.current = setTimeout(() => setOpenCat(null), 150);
  }

  return (
    <div className="sticky top-0 z-40">
      {/* نوار اطلاعیه */}
      <div className="brand-gradient text-white text-xs text-center py-1.5 px-4 truncate">
        {announcement}
      </div>

      <header className="bg-white/95 backdrop-blur border-b border-[var(--color-line)]">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            <Menu size={22} />
          </button>

          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl brand-gradient flex items-center justify-center text-white font-black text-lg">ک</div>
            <span className="font-black text-xl text-[var(--color-brand-deep)]">کالاژ</span>
          </Link>

          <form onSubmit={submitSearch} className="flex-1 hidden md:flex items-center bg-[var(--color-paper)] border border-[var(--color-line)] rounded-2xl px-4 py-2 relative">
            <Search size={18} className="text-gray-400" />
            <input
              value={q}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => q && setShowSuggest(true)}
              onBlur={() => setTimeout(() => setShowSuggest(false), 150)}
              placeholder="دنبال چی می‌گردی؟"
              className="bg-transparent flex-1 px-3 outline-none text-sm"
            />
            {showSuggest && suggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 mt-2 bg-white border border-[var(--color-line)] rounded-2xl shadow-xl overflow-hidden z-50">
                {suggestions.map((p) => (
                  <Link key={p.id} href={`/product/${p.slug}`} className="flex items-center justify-between px-4 py-3 hover:bg-[var(--color-paper)] border-b border-[var(--color-line)] last:border-0">
                    <span className="text-sm">{p.title}</span>
                    <span className="text-xs text-gray-400 price">{toman(p.price)}</span>
                  </Link>
                ))}
              </div>
            )}
          </form>

          <div className="flex items-center gap-1 md:gap-3 mr-auto">
            <Link href="/wishlist" className="hidden sm:flex p-2 rounded-xl hover:bg-[var(--color-paper)]" title="علاقه‌مندی‌ها">
              <Heart size={22} />
            </Link>
            <button onClick={toggle} className="p-2 rounded-xl hover:bg-[var(--color-paper)]" title="تغییر پوسته">
              {dark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button onClick={openDrawer} className="relative p-2 rounded-xl hover:bg-[var(--color-paper)]">
              <ShoppingCart size={22} />
              {count() > 0 && (
                <span className="absolute -top-1 -left-1 bg-[var(--color-coral)] text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {count()}
                </span>
              )}
            </button>

            {!hydrated ? null : user ? (
              <div className="flex items-center gap-2">
                {user.role !== 'CUSTOMER' && (
                  <Link
                    href={user.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/seller'}
                    className="hidden sm:flex items-center gap-1 text-sm px-3 py-2 rounded-xl hover:bg-[var(--color-paper)]"
                  >
                    <LayoutDashboard size={16} /> پنل
                  </Link>
                )}
                <Link href="/dashboard" className="hidden sm:block text-sm px-3 py-2 rounded-xl hover:bg-[var(--color-paper)]">
                  حساب من
                </Link>
                <span className="text-sm font-medium hidden lg:block">{user.name}</span>
                <button onClick={logout} className="p-2 rounded-xl hover:bg-[var(--color-paper)]" title="خروج">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <Link href="/login" className="flex items-center gap-1 text-sm px-4 py-2 rounded-xl bg-[var(--color-brand)] text-white font-medium hover:bg-[var(--color-brand-deep)]">
                <User size={16} /> ورود
              </Link>
            )}
          </div>
        </div>

        {/* مگامنو دسکتاپ */}
        <nav className="hidden md:block border-t border-[var(--color-line)]">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-1">
            {CATS.map((c) => (
              <div key={c.slug} className="relative" onMouseEnter={() => openMenu(c.slug)} onMouseLeave={scheduleClose}>
                <Link
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium hover:text-[var(--color-brand)] transition-colors"
                >
                  <span>{c.icon}</span> {c.name} <ChevronDown size={14} />
                </Link>
                {openCat === c.slug && (
                  <div className="absolute top-full right-0 bg-white border border-[var(--color-line)] rounded-2xl shadow-xl p-4 w-56 z-50">
                    <div className="flex flex-col gap-1">
                      {c.items.map((item) => (
                        <Link
                          key={item}
                          href={`/category/${c.slug}?q=${encodeURIComponent(item)}`}
                          className="text-sm px-3 py-2 rounded-lg hover:bg-[var(--color-paper)] hover:text-[var(--color-brand)]"
                        >
                          {item}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <Link href="/blog" className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium hover:text-[var(--color-brand)] transition-colors">
              📰 مجله
            </Link>
            <div className="relative" onMouseEnter={() => setMoreOpen(true)} onMouseLeave={() => setMoreOpen(false)}>
              <button className="flex items-center gap-1 px-4 py-2.5 text-sm font-medium hover:text-[var(--color-brand)] transition-colors">
                بیشتر <ChevronDown size={14} />
              </button>
              {moreOpen && (
                <div className="absolute top-full right-0 bg-white border border-[var(--color-line)] rounded-2xl shadow-xl p-2 w-48 z-50">
                  {MORE_LINKS.map((l) => (
                    <Link key={l.href} href={l.href} className="block text-sm px-3 py-2.5 rounded-lg hover:bg-[var(--color-paper)] hover:text-[var(--color-brand)]">
                      {l.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* منوی موبایل */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-b border-[var(--color-line)] px-4 py-4">
          <form onSubmit={submitSearch} className="flex items-center bg-[var(--color-paper)] border border-[var(--color-line)] rounded-2xl px-4 py-2 mb-4">
            <Search size={18} className="text-gray-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="جستجو..." className="bg-transparent flex-1 px-3 outline-none text-sm" />
          </form>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {CATS.map((c) => (
              <Link key={c.slug} href={`/category/${c.slug}`} onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-xl bg-[var(--color-paper)] text-sm font-medium">
                <span>{c.icon}</span> {c.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-1 border-t border-[var(--color-line)] pt-3">
            <Link href="/blog" onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm font-medium">📰 مجله</Link>
            {MORE_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} className="px-3 py-2.5 text-sm font-medium">{l.label}</Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
