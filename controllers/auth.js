const User = require('../models/user');

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    isAuthenticated: false,
  });
};

exports.postSignup = () => {};

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
      req.session.save(() => res.redirect('/'));
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
