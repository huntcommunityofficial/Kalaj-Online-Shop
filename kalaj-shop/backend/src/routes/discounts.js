const router = require('express').Router();
const prisma = require('../utils/prisma');
const { authRequired, requireRole } = require('../middleware/auth');

router.get('/', authRequired, requireRole('ADMIN'), async (req, res) => {
  const codes = await prisma.discountCode.findMany({ orderBy: { code: 'asc' } });
  res.json(codes);
});

router.post('/', authRequired, requireRole('ADMIN'), async (req, res) => {
  const { code, type, value, maxUses, minOrderTotal, expiresAt } = req.body;
  const created = await prisma.discountCode.create({
    data: {
      code: code.toUpperCase(),
      type,
      value: parseFloat(value),
      maxUses: maxUses ? parseInt(maxUses) : null,
      minOrderTotal: minOrderTotal ? parseFloat(minOrderTotal) : 0,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    },
  });
  res.json(created);
});

router.put('/:id', authRequired, requireRole('ADMIN'), async (req, res) => {
  const updated = await prisma.discountCode.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json(updated);
});

router.delete('/:id', authRequired, requireRole('ADMIN'), async (req, res) => {
  await prisma.discountCode.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// اعتبارسنجی کد تخفیف برای مشتری
router.post('/validate', authRequired, async (req, res) => {
  const { code, subtotal } = req.body;
  const dc = await prisma.discountCode.findUnique({ where: { code: code.toUpperCase() } });
  if (!dc || !dc.active) return res.status(400).json({ error: 'کد تخفیف نامعتبر است' });
  if (dc.expiresAt && new Date(dc.expiresAt) < new Date()) {
    return res.status(400).json({ error: 'کد تخفیف منقضی شده' });
  }
  if (dc.maxUses && dc.usedCount >= dc.maxUses) {
    return res.status(400).json({ error: 'ظرفیت کد تخفیف تمام شده' });
  }
  if (dc.minOrderTotal && subtotal < dc.minOrderTotal) {
    return res.status(400).json({ error: `حداقل مبلغ سفارش برای این کد ${dc.minOrderTotal} است` });
  }
  const discountAmount = dc.type === 'PERCENT' ? (subtotal * dc.value) / 100 : dc.value;
  res.json({ valid: true, discountAmount: Math.min(discountAmount, subtotal), code: dc.code, id: dc.id });
});

module.exports = router;
