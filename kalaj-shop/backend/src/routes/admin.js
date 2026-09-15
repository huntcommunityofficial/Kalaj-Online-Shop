const router = require('express').Router();
const prisma = require('../utils/prisma');
const { authRequired, requireRole } = require('../middleware/auth');

router.use(authRequired, requireRole('ADMIN'));

router.get('/stats', async (req, res) => {
  const [users, sellers, products, orders] = await Promise.all([
    prisma.user.count(),
    prisma.seller.count(),
    prisma.product.count(),
    prisma.order.findMany(),
  ]);
  const revenue = orders.filter(o => o.status !== 'PENDING_PAYMENT').reduce((s, o) => s + o.total, 0);
  res.json({ users, sellers, products, orderCount: orders.length, revenue });
});

router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(users);
});

router.get('/products/pending', async (req, res) => {
  const products = await prisma.product.findMany({
    where: { status: 'PENDING' },
    include: { seller: true, category: true },
  });
  res.json(products);
});

router.put('/products/:id/approve', async (req, res) => {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { status: 'APPROVED' },
  });
  res.json(product);
});

router.put('/products/:id/reject', async (req, res) => {
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { status: 'REJECTED' },
  });
  res.json(product);
});

router.get('/orders', async (req, res) => {
  const orders = await prisma.order.findMany({
    include: { user: true, items: true, payment: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

module.exports = router;
