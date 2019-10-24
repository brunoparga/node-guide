require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mailer = require('@sendgrid/mail');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const renderError = require('../helpers/render-error');

mailer.setApiKey(process.env.SENDGRID_API_KEY);

const SIGNUP = {
  view: 'auth/signup',
  path: '/signup',
  pageTitle: 'Sign Up',
};

const LOGIN = {
  view: 'auth/login',
  path: '/login',
  pageTitle: 'Log In',
};

const RESET = {
  view: 'auth/reset',
  path: '/reset',
  pageTitle: 'Reset password',
};

const render = (page, res, errorMessage, inputEmail, status = 200) => {
  const { path, pageTitle } = page;
  return res.status(status).render(page.view, {
    path, pageTitle, errorMessage, inputEmail,
  });
};

exports.getSignup = (req, res) => render(SIGNUP, res, req.flash('error')[0], '');

exports.postSignup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let inputEmail;
    if (errors.array().every((error) => error.param !== 'email')) {
      inputEmail = req.body.email;
    }
    return render(SIGNUP, res, errors.array()[0].msg, inputEmail, 422);
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
    })
    .catch((err) => renderError(err, next));
};

exports.getLogin = (req, res) => render(LOGIN, res, req.flash('error')[0], '');

exports.postLogin = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let inputEmail;
    if (errors.array().every((error) => error.param !== 'email')) {
      inputEmail = req.body.email;
    }
    return render(LOGIN, res, errors.array()[0].msg, inputEmail, 422);
  }

  const { email, password } = req.body;
  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        return render(LOGIN, res, 'Invalid email or password.', email, 422);
      }
      return bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            req.session.user = user;
            return req.session.save(() => res.redirect('/'));
          }
          return render(LOGIN, res, 'Invalid email or password.', email, 422);
        })
        .catch((err) => renderError(err, next));
    })
    .catch((err) => renderError(err, next));
};

exports.getReset = (req, res) => render(RESET, res, req.flash('error')[0], '');

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (error, buffer) => {
    if (error) {
      return render(RESET, res, 'Please try again.', '');
    }
    const token = buffer.toString('hex');
    return User
      .findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return render(RESET, res, 'Email not found.', req.body.email, 422);
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
      })
      .catch((err) => renderError(err, next));
  });
};

exports.getNewPassword = (req, res, next) => {
  const { token } = req.params;
  User
    .findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    })
    .then((user) => {
      if (!user) {
        renderError({
          errmsg: 'Reset token not found or expired. Please try again.',
        }, next);
      } else {
        res.render('auth/new-password', {
          path: '/new-password',
          pageTitle: 'New Password',
          errorMessage: req.flash('error')[0],
          _id: user._id.toString(),
          resetToken: token,
        });
      }
    })
    .catch((err) => renderError(err, next));
};

exports.postNewPassword = (req, res, next) => {
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
    .then(() => res.redirect('/login'))
    .catch((err) => renderError(err, next));
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
