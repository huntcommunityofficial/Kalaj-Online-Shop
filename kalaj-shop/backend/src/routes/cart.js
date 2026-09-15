const router = require('express').Router();
const prisma = require('../utils/prisma');
const { authRequired } = require('../middleware/auth');

router.use(authRequired);

async function getOrCreateCart(userId) {
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    const err = new Error('کاربر یافت نشد. لطفاً دوباره وارد حساب کاربری خود شوید.');
    err.statusCode = 401;
    throw err;
  }
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: { include: { product: true } } },
  });
  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }
  return cart;
}

router.get('/', async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    res.json(cart);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message || 'خطا در دریافت سبد خرید' });
  }
});

router.post('/items', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = await getOrCreateCart(req.user.id);
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) return res.status(404).json({ error: 'محصول یافت نشد' });

    const existing = await prisma.cartItem.findUnique({
      where: { cartId_productId: { cartId: cart.id, productId } },
    }).catch(() => null);

    let item;
    if (existing) {
      item = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + (quantity || 1) },
      });
    } else {
      item = await prisma.cartItem.create({
        data: { cartId: cart.id, productId, quantity: quantity || 1 },
      });
    }
    res.json(item);
  } catch (e) {
    res.status(e.statusCode || 500).json({ error: e.message || 'خطا در افزودن به سبد خرید' });
  }
});

router.put('/items/:id', async (req, res) => {
  const { quantity } = req.body;
  const item = await prisma.cartItem.update({
    where: { id: req.params.id },
    data: { quantity },
  });
  res.json(item);
});

router.delete('/items/:id', async (req, res) => {
  await prisma.cartItem.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

module.exports = router;
