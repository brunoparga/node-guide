const router = require('express').Router();
const adminRoutes = require('../routes/admin');
const authRoutes = require('../routes/auth');
const shopRoutes = require('../routes/shop');
const pagesController = require('../controllers/pages');

router.use('/admin', adminRoutes);
router.use(authRoutes, shopRoutes, pagesController.get404);

module.exports = router;
