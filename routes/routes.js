const router = require('express').Router();
const adminRoutes = require('../routes/admin');
const authRoutes = require('../routes/auth');
const shopRoutes = require('../routes/shop');
const errorRoutes = require('../routes/error');

router.use('/admin', adminRoutes);
router.use(authRoutes, shopRoutes, errorRoutes);

module.exports = router;
