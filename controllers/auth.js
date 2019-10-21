require('dotenv').config();
const bcrypt = require('bcryptjs');
const mailer = require('@sendgrid/mail');

mailer.setApiKey(process.env.SENDGRID_API_KEY);
const User = require('../models/user');

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Sign Up',
    errorMessage: req.flash('error')[0],
  });
};

exports.postSignup = (req, res) => {
  const { email, password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    req.flash('error', "The passwords don't match.");
    return res.redirect('/signup');
  }
  return User.findOne({ email })
    .then((user) => {
      if (user) {
        req.flash('error', 'Email already taken.');
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
          mailer.send({
            to: email,
            from: 'welcome@superstore.com',
            subject: 'Welcome to the Amazon-Killer!',
            html: '<h1>Hi there!!!!</h1>',
          });
          res.redirect('/login');
        });
    });
};

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Log In',
    errorMessage: req.flash('error')[0],
  });
};

exports.postLogin = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      return bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            req.session.user = user;
            return req.session.save(() => res.redirect('/'));
          }
          req.flash('error', 'Invalid email or password.');
          return res.redirect('/login');
        });
    });
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
