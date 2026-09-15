const router = require('express').Router();
const prisma = require('../utils/prisma');
const { authRequired, requireRole } = require('../middleware/auth');

// لیست محصولات با فیلتر و جستجو
router.get('/', async (req, res) => {
  const { q, category, minPrice, maxPrice, sort } = req.query;
  const where = { status: 'APPROVED' };
  if (q) where.title = { contains: q };
  if (category) where.category = { slug: category };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }

  let orderBy = { createdAt: 'desc' };
  if (sort === 'price_asc') orderBy = { price: 'asc' };
  if (sort === 'price_desc') orderBy = { price: 'desc' };

  const products = await prisma.product.findMany({
    where,
    orderBy,
    include: { category: true, seller: true, reviews: true },
  });
  res.json(products);
});

router.get('/:slug', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { slug: req.params.slug },
    include: { category: true, seller: true, reviews: { include: { user: true } } },
  });
  if (!product) return res.status(404).json({ error: 'محصول یافت نشد' });
  res.json(product);
});

// ایجاد محصول - فقط فروشنده
router.post('/', authRequired, requireRole('SELLER'), async (req, res) => {
  try {
    const { title, description, price, compareAt, stock, images, categoryId } = req.body;
    const seller = await prisma.seller.findUnique({ where: { userId: req.user.id } });
    if (!seller) {
      return res.status(404).json({ error: 'پروفایل فروشندگی شما یافت نشد. لطفاً از حساب خارج شده و دوباره وارد شوید.' });
    }
    const slug = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        compareAt: compareAt ? parseFloat(compareAt) : null,
        stock: parseInt(stock) || 0,
        images: JSON.stringify(images || []),
        categoryId,
        sellerId: seller.id,
        status: 'PENDING',
      },
    });
    res.json(product);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'خطا در ایجاد محصول' });
  }
});

router.put('/:id', authRequired, requireRole('SELLER', 'ADMIN'), async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { seller: true } });
  if (!product) return res.status(404).json({ error: 'یافت نشد' });
  if (req.user.role === 'SELLER' && product.seller.userId !== req.user.id) {
    return res.status(403).json({ error: 'غیرمجاز' });
  }
  const data = { ...req.body };
  delete data.status; // seller can't self-approve
  if (data.price) data.price = parseFloat(data.price);
  if (data.stock) data.stock = parseInt(data.stock);
  if (data.images) data.images = JSON.stringify(data.images);
  const updated = await prisma.product.update({ where: { id: req.params.id }, data });
  res.json(updated);
});

router.delete('/:id', authRequired, requireRole('SELLER', 'ADMIN'), async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.id }, include: { seller: true } });
  if (!product) return res.status(404).json({ error: 'یافت نشد' });
  if (req.user.role === 'SELLER' && product.seller.userId !== req.user.id) {
    return res.status(403).json({ error: 'غیرمجاز' });
  }
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// ثبت نظر توسط مشتری (فقط کاربران لاگین‌کرده)
router.post('/:id/reviews', authRequired, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'امتیاز باید بین ۱ تا ۵ باشد' });
    }
    const review = await prisma.review.create({
      data: { productId: req.params.id, userId: req.user.id, rating: parseInt(rating), comment },
      include: { user: true },
    });
    res.json(review);
  } catch (e) {
    res.status(500).json({ error: 'خطا در ثبت نظر' });
  }
});

module.exports = router;
