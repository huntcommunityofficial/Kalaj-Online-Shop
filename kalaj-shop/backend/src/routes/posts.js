const router = require('express').Router();
const prisma = require('../utils/prisma');
const { authRequired, requireRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(posts);
});

router.get('/:slug', async (req, res) => {
  const post = await prisma.post.findUnique({ where: { slug: req.params.slug } });
  if (!post) return res.status(404).json({ error: 'مقاله یافت نشد' });
  res.json(post);
});

router.post('/', authRequired, requireRole('ADMIN'), async (req, res) => {
  const { title, excerpt, content, coverImage, category } = req.body;
  const slug = title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  const post = await prisma.post.create({
    data: { title, slug, excerpt, content, coverImage, category },
  });
  res.json(post);
});

router.put('/:id', authRequired, requireRole('ADMIN'), async (req, res) => {
  const post = await prisma.post.update({ where: { id: req.params.id }, data: req.body });
  res.json(post);
});

router.delete('/:id', authRequired, requireRole('ADMIN'), async (req, res) => {
  await prisma.post.delete({ where: { id: req.params.id } });
  res.json({ ok: true });
});

// برای پنل ادمین - شامل مقالات منتشرنشده هم می‌شود
router.get('/admin/all', authRequired, requireRole('ADMIN'), async (req, res) => {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: 'desc' } });
  res.json(posts);
});

module.exports = router;
