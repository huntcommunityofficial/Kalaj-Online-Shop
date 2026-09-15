const router = require('express').Router();
const prisma = require('../utils/prisma');
const { authRequired, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

router.post('/', authRequired, requireRole('ADMIN'), async (req, res) => {
  const { name, icon } = req.body;
  const slug = name.toLowerCase().replace(/\s+/g, '-');
  const category = await prisma.category.create({ data: { name, slug, icon } });
  res.json(category);
});

router.delete('/:id', authRequired, requireRole('ADMIN'), async (req, res) => {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

module.exports = router;
