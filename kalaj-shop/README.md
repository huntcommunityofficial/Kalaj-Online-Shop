# کالاژ — فروشگاه اینترنتی (مثل دیجی‌کالا)

## ساختار
- `backend/`  → Node.js + Express + Prisma (SQLite)
- `frontend/` → Next.js 15 + Tailwind + TypeScript

## راه‌اندازی Backend
```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run seed      # ساخت داده‌های آزمایشی + کاربران تست
npm run dev        # اجرا روی پورت 4000
```

کاربران تست (رمز همه: 123456):
- ادمین: admin@shop.ir
- فروشنده: seller@shop.ir
- مشتری: customer@shop.ir

## راه‌اندازی Frontend
```bash
cd frontend
npm install
npm run dev        # اجرا روی پورت 3000
```

فایل `.env.local` آدرس API را مشخص می‌کند (پیش‌فرض: http://localhost:4000/api).

## قابلیت‌ها
- ثبت‌نام/ورود با JWT (مشتری / فروشنده)
- پنل مشتری: جستجو، فیلتر، سبد خرید، کد تخفیف، پرداخت (mock)، پیگیری سفارش
- پنل فروشنده: افزودن محصول (نیازمند تایید ادمین)، آمار فروش، کیف پول
- پنل ادمین: تایید/رد محصولات، ساخت کد تخفیف، آمار کلی سایت، لیست سفارش‌ها
- درگاه پرداخت به‌صورت mock پیاده شده — برای اتصال واقعی به زرین‌پال/آیدی‌پی باید route `orders.js -> /:id/pay` جایگزین شود.

## نکات فنی
- دیتابیس SQLite برای شروع سریع؛ برای production پیشنهاد می‌شود به PostgreSQL سوییچ کنید (فقط تغییر provider در schema.prisma).
- طراحی RTL و فونت Vazirmatn.
