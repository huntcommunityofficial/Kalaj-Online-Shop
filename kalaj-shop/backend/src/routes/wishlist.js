const router = require('express').Router();
const prisma = require('../utils/prisma');
const { authRequired } = require('../middleware/auth');

router.use(authRequired);

router.get('/', async (req, res) => {
  const items = await prisma.wishlist.findMany({ where: { userId: req.user.id } });
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    include: { category: true, seller: true },
  });
  res.json(products);
});

router.post('/:productId', async (req, res) => {
  try {
    const item = await prisma.wishlist.create({
      data: { userId: req.user.id, productId: req.params.productId },
    });
    res.json(item);
  } catch (e) {
    res.status(400).json({ error: 'این محصول قبلاً به علاقه‌مندی‌ها اضافه شده' });
  }
});

router.delete('/:productId', async (req, res) => {
  await prisma.wishlist.deleteMany({ where: { userId: req.user.id, productId: req.params.productId } });
  res.json({ ok: true });
});

module.exports = router;
