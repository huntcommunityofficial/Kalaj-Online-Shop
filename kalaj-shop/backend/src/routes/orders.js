const router = require('express').Router();
const prisma = require('../utils/prisma');
const { authRequired, requireRole } = require('../middleware/auth');

router.use(authRequired);

// ایجاد سفارش از سبد خرید فعلی + اعمال کد تخفیف
router.post('/checkout', async (req, res) => {
  try {
    const { address, discountCode } = req.body;
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'سبد خرید خالی است' });
    }

    const subtotal = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
    let discountAmount = 0;
    let discountCodeId = null;

    if (discountCode) {
      const dc = await prisma.discountCode.findUnique({ where: { code: discountCode.toUpperCase() } });
      if (dc && dc.active && (!dc.maxUses || dc.usedCount < dc.maxUses)) {
        discountAmount = dc.type === 'PERCENT' ? (subtotal * dc.value) / 100 : dc.value;
        discountAmount = Math.min(discountAmount, subtotal);
        discountCodeId = dc.id;
      }
    }

    const total = subtotal - discountAmount;

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        subtotal,
        discountAmount,
        total,
        address,
        discountCodeId,
        items: {
          create: cart.items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.product.price,
          })),
        },
        payment: { create: { status: 'PENDING' } },
      },
      include: { items: true, payment: true },
    });

    if (discountCodeId) {
      await prisma.discountCode.update({
        where: { id: discountCodeId },
        data: { usedCount: { increment: 1 } },
      });
    }

    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    res.json(order);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'خطا در ثبت سفارش' });
  }
});

// درگاه پرداخت آزمایشی (mock) - در دنیای واقعی اینجا به زرین‌پال/آیدی‌پی وصل می‌شود
router.post('/:id/pay', async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: req.params.id } });
  if (!order || order.userId !== req.user.id) return res.status(404).json({ error: 'یافت نشد' });

  const refId = 'PAY-' + Math.random().toString(36).slice(2, 10).toUpperCase();
  await prisma.payment.update({
    where: { orderId: order.id },
    data: { status: 'SUCCESS', refId },
  });
  const updated = await prisma.order.update({
    where: { id: order.id },
    data: { status: 'PAID' },
    include: { items: { include: { product: true } }, payment: true },
  });

  // واریز سهم فروشندگان به کیف پول
  for (const item of updated.items) {
    const product = await prisma.product.findUnique({ where: { id: item.productId } });
    await prisma.seller.update({
      where: { id: product.sellerId },
      data: { balance: { increment: item.price * item.quantity } },
    });
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  res.json(updated);
});

router.get('/', async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } }, payment: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(orders);
});

router.get('/:id', async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: { include: { product: true } }, payment: true },
  });
  if (!order || (order.userId !== req.user.id && req.user.role !== 'ADMIN')) {
    return res.status(404).json({ error: 'یافت نشد' });
  }
  res.json(order);
});

// ادمین: تغییر وضعیت سفارش
router.put('/:id/status', requireRole('ADMIN', 'SELLER'), async (req, res) => {
  const { status } = req.body;
  const updated = await prisma.order.update({ where: { id: req.params.id }, data: { status } });
  res.json(updated);
});

module.exports = router;
