const router = require('express').Router();
const prisma = require('../utils/prisma');
const jwt = require('jsonwebtoken');

// اگر کاربر لاگین باشد، شناسه‌اش را (بدون اجباری بودن) استخراج می‌کند
function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (header) {
    try {
      const token = header.replace('Bearer ', '');
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {}
  }
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') return res.status(403).json({ error: 'دسترسی غیرمجاز' });
  next();
}

// ساخت تیکت جدید + اولین پیام (عمومی - نیاز به لاگین ندارد)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { name, email, message, guestId } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ error: 'پیام نمی‌تواند خالی باشد' });

    const ticket = await prisma.supportTicket.create({
      data: {
        name: name || req.user?.name || 'کاربر مهمان',
        email: email || req.user?.email || null,
        userId: req.user?.id || null,
        guestId: req.user ? null : guestId || null,
        messages: { create: { sender: 'USER', message } },
      },
      include: { messages: true },
    });
    res.json(ticket);
  } catch (e) {
    res.status(500).json({ error: 'خطا در ایجاد تیکت' });
  }
});

// دریافت تیکت‌های خود کاربر (بر اساس userId یا guestId)
router.get('/mine', optionalAuth, async (req, res) => {
  const { guestId } = req.query;
  const where = req.user ? { userId: req.user.id } : guestId ? { guestId } : null;
  if (!where) return res.json([]);
  const tickets = await prisma.supportTicket.findMany({
    where,
    include: { messages: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(tickets);
});

// افزودن پیام به یک تیکت موجود (کاربر یا ادمین)
router.post('/:id/messages', optionalAuth, async (req, res) => {
  try {
    const { message, guestId } = req.body;
    if (!message || !message.trim()) return res.status(400).json({ error: 'پیام نمی‌تواند خالی باشد' });

    const ticket = await prisma.supportTicket.findUnique({ where: { id: req.params.id } });
    if (!ticket) return res.status(404).json({ error: 'تیکت یافت نشد' });

    const isAdmin = req.user?.role === 'ADMIN';
    const isOwner = (req.user && ticket.userId === req.user.id) || (!req.user && guestId && ticket.guestId === guestId);
    if (!isAdmin && !isOwner) return res.status(403).json({ error: 'دسترسی غیرمجاز' });

    const msg = await prisma.supportMessage.create({
      data: { ticketId: ticket.id, sender: isAdmin ? 'ADMIN' : 'USER', message },
    });

    if (isAdmin && ticket.status === 'CLOSED') {
      await prisma.supportTicket.update({ where: { id: ticket.id }, data: { status: 'OPEN' } });
    }

    res.json(msg);
  } catch (e) {
    res.status(500).json({ error: 'خطا در ارسال پیام' });
  }
});

// ادمین: لیست همه تیکت‌ها
router.get('/admin/all', optionalAuth, requireAdmin, async (req, res) => {
  const tickets = await prisma.supportTicket.findMany({
    include: { messages: { orderBy: { createdAt: 'asc' } } },
    orderBy: { createdAt: 'desc' },
  });
  res.json(tickets);
});

// ادمین: تغییر وضعیت تیکت
router.put('/:id/status', optionalAuth, requireAdmin, async (req, res) => {
  const { status } = req.body;
  const ticket = await prisma.supportTicket.update({ where: { id: req.params.id }, data: { status } });
  res.json(ticket);
});

module.exports = router;
