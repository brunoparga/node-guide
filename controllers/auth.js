const User = require('../models/user');

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Log In',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res) => {
  User.findById('5da78d888ccb1f3c98043d2b')
    .then((user) => {
      req.session.user = user;
      res.redirect('/');
    });
};
