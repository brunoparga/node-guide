const router = require('express').Router();
const adminRoutes = require('../routes/admin');
const authRoutes = require('../routes/auth');
const shopRoutes = require('../routes/shop');

router.use('/admin', adminRoutes);
router.use(authRoutes, shopRoutes);

module.exports = router;
