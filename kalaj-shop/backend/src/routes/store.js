const router = require('express').Router();
const prisma = require('../utils/prisma');

router.get('/:id', async (req, res) => {
  const seller = await prisma.seller.findUnique({ where: { id: req.params.id } });
  if (!seller) return res.status(404).json({ error: 'فروشگاه یافت نشد' });
  const products = await prisma.product.findMany({
    where: { sellerId: seller.id, status: 'APPROVED' },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
  const reviews = await prisma.review.findMany({
    where: { product: { sellerId: seller.id } },
  });
  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null;
  res.json({
    id: seller.id,
    storeName: seller.storeName,
    description: seller.description,
    createdAt: seller.createdAt,
    productCount: products.length,
    avgRating,
    reviewCount: reviews.length,
    products,
  });
});

module.exports = router;
