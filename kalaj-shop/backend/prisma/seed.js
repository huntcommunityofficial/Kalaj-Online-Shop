const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const pass = await bcrypt.hash('123456', 10);

  const admin = await prisma.user.create({
    data: { name: 'ادمین سایت', email: 'admin@shop.ir', passwordHash: pass, role: 'ADMIN' },
  });

  const sellerUser = await prisma.user.create({
    data: { name: 'فروشگاه یاسین', email: 'seller@shop.ir', passwordHash: pass, role: 'SELLER' },
  });
  const seller = await prisma.seller.create({
    data: { userId: sellerUser.id, storeName: 'دیجی‌یاسین' },
  });

  const customer = await prisma.user.create({
    data: { name: 'مشتری تست', email: 'customer@shop.ir', passwordHash: pass, role: 'CUSTOMER' },
  });
  await prisma.cart.create({ data: { userId: customer.id } });

  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'موبایل', slug: 'mobile', icon: '📱' } }),
    prisma.category.create({ data: { name: 'لپ‌تاپ', slug: 'laptop', icon: '💻' } }),
    prisma.category.create({ data: { name: 'لوازم جانبی', slug: 'accessories', icon: '🎧' } }),
    prisma.category.create({ data: { name: 'پوشاک', slug: 'fashion', icon: '👕' } }),
  ]);

  const products = [
    { title: 'گوشی موبایل شیائومی نوت ۱۳', price: 12500000, cat: 0, stock: 20 },
    { title: 'گوشی سامسونگ گلکسی A54', price: 15800000, cat: 0, stock: 15 },
    { title: 'لپ‌تاپ ایسوس Vivobook', price: 32000000, cat: 1, stock: 8 },
    { title: 'لپ‌تاپ لنوو IdeaPad', price: 27500000, cat: 1, stock: 10 },
    { title: 'هدفون بی‌سیم سونی', price: 3200000, cat: 2, stock: 30 },
    { title: 'پاوربانک انکر ۲۰۰۰۰', price: 950000, cat: 2, stock: 50 },
    { title: 'تیشرت مردانه نخی', price: 350000, cat: 3, stock: 100 },
    { title: 'کاپشن زمستانی', price: 1450000, cat: 3, stock: 40 },
  ];

  for (const p of products) {
    await prisma.product.create({
      data: {
        title: p.title,
        slug: p.title.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2, 7),
        description: `${p.title} با بهترین کیفیت و گارانتی اصالت و سلامت کالا.`,
        price: p.price,
        compareAt: p.price * 1.15,
        stock: p.stock,
        images: JSON.stringify([]),
        categoryId: categories[p.cat].id,
        sellerId: seller.id,
        status: 'APPROVED',
      },
    });
  }

  await prisma.discountCode.create({
    data: { code: 'WELCOME10', type: 'PERCENT', value: 10, maxUses: 100, minOrderTotal: 100000 },
  });
  await prisma.discountCode.create({
    data: { code: 'FIX50K', type: 'FIXED', value: 50000, maxUses: 50 },
  });

  const posts = [
    {
      title: 'راهنمای خرید گوشی موبایل در سال ۱۴۰۴',
      excerpt: 'قبل از خرید گوشی جدید حتماً این نکات کلیدی رو در نظر بگیرید.',
      content: 'انتخاب گوشی مناسب به نیاز واقعی شما بستگی دارد نه فقط بروزترین مدل بازار. به مواردی مثل باتری، دوربین، پردازنده و بودجه توجه کنید. همچنین گارانتی و خدمات پس از فروش را فراموش نکنید.',
      category: 'راهنمای خرید',
    },
    {
      title: '۵ ترفند برای افزایش عمر باتری لپ‌تاپ',
      excerpt: 'با این نکات ساده باتری لپ‌تاپ خود را بیشتر نگه دارید.',
      content: 'کاهش روشنایی صفحه‌نمایش، بستن برنامه‌های پس‌زمینه غیرضروری، استفاده از حالت صرفه‌جویی انرژی و اجتناب از شارژ کامل مداوم از جمله راهکارهایی هستند که به افزایش عمر باتری کمک می‌کنند.',
      category: 'راهنما',
    },
    {
      title: 'چطور فروشنده موفقی در کالاژ باشیم؟',
      excerpt: 'نکاتی برای فروشندگانی که می‌خواهند فروش بیشتری داشته باشند.',
      content: 'عکس‌های باکیفیت، توضیحات دقیق محصول، پاسخگویی سریع به مشتریان و قیمت‌گذاری منصفانه از عوامل اصلی موفقیت فروشندگان در بازارهای آنلاین است.',
      category: 'کسب‌وکار',
    },
  ];
  for (const p of posts) {
    await prisma.post.create({
      data: { ...p, slug: p.title.toLowerCase().replace(/\s+/g, '-') + '-' + Math.random().toString(36).slice(2, 7) },
    });
  }

  console.log('✅ داده‌های آزمایشی ساخته شد');
  console.log('ادمین: admin@shop.ir / 123456');
  console.log('فروشنده: seller@shop.ir / 123456');
  console.log('مشتری: customer@shop.ir / 123456');
}

main().finally(() => prisma.$disconnect());
