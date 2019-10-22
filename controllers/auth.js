require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mailer = require('@sendgrid/mail');
const { validationResult } = require('express-validator');

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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .render('auth/signup', {
        path: '/signup',
        pageTitle: 'Sign Up',
        errorMessage: errors.array()[0].msg,
      });
  }

  const { email, password } = req.body;
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
};

exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Log In',
    errorMessage: req.flash('error')[0],
  });
};

exports.postLogin = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422)
      .render('auth/login', {
        path: '/login',
        pageTitle: 'Log In',
        errorMessage: errors.array()[0].msg,
      });
  }

  const { email, password } = req.body;
  return User.findOne({ email })
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

exports.getReset = (req, res) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset password',
    errorMessage: req.flash('error')[0],
  });
};

exports.postReset = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect('/reset');
    }
    const token = buffer.toString('hex');
    return User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash('error', 'Email not found.');
          return res.redirect('/reset');
        }
        const newUser = user;
        newUser.resetToken = token;
        newUser.resetTokenExpiration = Date.now() + 3600000;
        return newUser.save();
      })
      .then(() => {
        res.redirect('/');
        mailer.send({
          to: req.body.email,
          from: 'recovery@superstore.com',
          subject: 'Recover your password',
          html: `
            <p>Someone (likely you) requested a password reset for this email.</p>
            <p>Click <a href="http://localhost:3000/new-password/${token}">this link</a> to reset your password:</p>

            Cheers,<br>
            SuperStore.com
          `,
        });
      });
  });
};

exports.getNewPassword = (req, res) => {
  const { token } = req.params;
  User
    .findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Invalid recovery token.');
        res.redirect('/');
      } else {
        res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'New Password',
          errorMessage: req.flash('error')[0],
          _id: user._id.toString(),
          resetToken: token,
        });
      }
    });
};

exports.postNewPassword = (req, res) => {
  const {
    _id, newPassword, confirmPassword, resetToken,
  } = req.body;
  if (newPassword !== confirmPassword) {
    req.flash('error', "The passwords don't match.");
    return res.redirect('/signup');
  }
  let updatedUser;
  return User
    .findOne({
      _id,
      resetToken,
      resetTokenExpiration: { $gt: Date.now() },
    })
    .then((user) => {
      updatedUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      updatedUser.password = hashedPassword;
      updatedUser.resetToken = undefined;
      updatedUser.resetTokenExpiration = undefined;
      return updatedUser.save();
    })
    .then(() => res.redirect('/login'));
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
