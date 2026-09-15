const router = require('express').Router();
const prisma = require('../utils/prisma');
const { authRequired, requireRole } = require('../middleware/auth');

router.use(authRequired, requireRole('SELLER'));

async function getSellerOrFail(userId) {
  const seller = await prisma.seller.findUnique({ where: { userId } });
  if (!seller) {
    const err = new Error('پروفایل فروشندگی شما یافت نشد. لطفاً از حساب خارج شده و دوباره وارد شوید، یا با پشتیبانی تماس بگیرید.');
    err.statusCode = 404;
    throw err;
  }
  return seller;
}

router.get('/me', async (req, res) => {
  try {
    const seller = await getSellerOrFail(req.user.id);
    res.json(seller);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message || 'خطای سرور' });
  }
});

router.get('/products', async (req, res) => {
  try {
    const seller = await getSellerOrFail(req.user.id);
    const products = await prisma.product.findMany({
      where: { sellerId: seller.id },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(products);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message || 'خطای سرور' });
  }
});

router.get('/orders', async (req, res) => {
  try {
    const seller = await getSellerOrFail(req.user.id);
    const items = await prisma.orderItem.findMany({
      where: { product: { sellerId: seller.id } },
      include: { order: { include: { user: true } }, product: true },
      orderBy: { id: 'desc' },
    });
    res.json(items);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message || 'خطای سرور' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const seller = await getSellerOrFail(req.user.id);
    const productCount = await prisma.product.count({ where: { sellerId: seller.id } });
    const soldItems = await prisma.orderItem.findMany({
      where: { product: { sellerId: seller.id }, order: { status: { not: 'PENDING_PAYMENT' } } },
    });
    const totalSales = soldItems.reduce((s, i) => s + i.price * i.quantity, 0);
    res.json({ productCount, totalSales, balance: seller.balance, itemsSold: soldItems.length });
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message || 'خطای سرور' });
  }
});

module.exports = router;
