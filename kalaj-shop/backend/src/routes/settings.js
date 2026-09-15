const router = require('express').Router();
const prisma = require('../utils/prisma');
const { authRequired, requireRole } = require('../middleware/auth');

const DEFAULTS = {
  announcement: '🚚 ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان — تا پایان هفته',
};

// عمومی - همه می‌توانند تنظیمات نمایشی سایت را بخوانند
router.get('/', async (req, res) => {
  const rows = await prisma.setting.findMany();
  const settings = { ...DEFAULTS };
  rows.forEach((r) => { settings[r.key] = r.value; });
  res.json(settings);
});

// فقط ادمین می‌تواند تغییر دهد
router.put('/:key', authRequired, requireRole('ADMIN'), async (req, res) => {
  const { value } = req.body;
  const updated = await prisma.setting.upsert({
    where: { key: req.params.key },
    update: { value },
    create: { key: req.params.key, value },
  });
  res.json(updated);
});

module.exports = router;
