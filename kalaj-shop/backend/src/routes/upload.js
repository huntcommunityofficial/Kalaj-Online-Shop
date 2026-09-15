const router = require('express').Router();
const upload = require('../middleware/upload');
const { authRequired, requireRole } = require('../middleware/auth');

// آپلود یک یا چند تصویر - فروشنده یا ادمین
router.post('/', authRequired, requireRole('SELLER', 'ADMIN'), upload.array('images', 6), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: 'فایلی ارسال نشده' });
  }
  const urls = req.files.map((f) => `/uploads/${f.filename}`);
  res.json({ urls });
});

module.exports = router;
