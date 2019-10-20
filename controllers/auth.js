const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    isAuthenticated: false,
  });
};

exports.postSignup = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12)
        .then((hashedPassword) => new User({
          email,
          password: hashedPassword,
          cart: {
            items: [],
          },
        }).save())
        .then(() => {
          res.redirect('/login');
        });
    });
};

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Log In',
    isAuthenticated: false,
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) { return res.redirect('/login'); }
      return bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            req.session.user = user;
            return req.session.save(() => res.redirect('/'));
          }
          return res.redirect('/login');
        });
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
