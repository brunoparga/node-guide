const router = require('express').Router();

router.get('/login', (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Log In',
  });
});

module.exports = router;
