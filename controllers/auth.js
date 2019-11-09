require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mailer = require('@sendgrid/mail');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const renderError = require('../services/render-error');

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

const validateSignup = (req, res, login = true) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let inputEmail;
    if (errors.array().every((error) => error.param !== 'email')) {
      inputEmail = req.body.email;
    }
    render((login ? LOGIN : SIGNUP), res, errors.array()[0].msg, inputEmail, 422);
    return false;
  }
  return true;
};

exports.getSignup = (req, res) => render(SIGNUP, res, req.flash('error')[0], '');

exports.postSignup = async (req, res, next) => {
  const passedValidation = validateSignup(req, res, false);
  if (!passedValidation) {
    return;
  }
  const { email } = req.body;
  let { password } = req.body;
  try {
    password = await bcrypt.hash(password, 12);
    await new User({ email, password, cart: { items: [] } }).save();
    await mailer.send({
      to: email,
      from: 'welcome@superstore.com',
      subject: 'Welcome to the Amazon-Killer!',
      html: '<h1>Hi there!!!!</h1>',
    });
    res.redirect('/login');
  } catch (err) {
    renderError(err, next);
  }
};

exports.getLogin = (req, res) => render(LOGIN, res, req.flash('error')[0], '');

exports.postLogin = async (req, res, next) => {
  const passedValidation = validateSignup(req, res, false);
  if (!passedValidation) {
    return;
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      req.session.save(() => res.redirect('/'));
    } else {
      render(LOGIN, res, 'Invalid email or password.', email, 422);
    }
  } catch (err) {
    renderError(err, next);
  }
};

exports.getReset = (req, res) => render(RESET, res, req.flash('error')[0], '');

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, async (error, buffer) => {
    if (error) {
      return render(RESET, res, 'There was a server error; please try again.', '');
    }
    const token = buffer.toString('hex');
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return render(RESET, res, 'Email not found.', req.body.email, 422);
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      res.redirect('/');
      return mailer.send({
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
    } catch (err) {
      return renderError(err, next);
    }
  });
};

exports.getNewPassword = async (req, res, next) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiration: { $gt: Date.now() },
    });
    if (user) {
      res.render('auth/new-password', {
        path: '/new-password',
        pageTitle: 'New Password',
        errorMessage: req.flash('error')[0],
        _id: user._id.toString(),
        resetToken: token,
      });
    } else {
      renderError({
        errmsg: 'Reset token not found or expired. Please try again.',
      }, next);
    }
  } catch (err) {
    renderError(err, next);
  }
};

exports.postNewPassword = async (req, res, next) => {
  const {
    _id, newPassword, confirmPassword, resetToken,
  } = req.body;
  if (newPassword !== confirmPassword) {
    req.flash('error', "The passwords don't match.");
    return res.redirect('/signup');
  }
  try {
    const user = await User
      .findOne({
        _id,
        resetToken,
        resetTokenExpiration: { $gt: Date.now() },
      });
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();
    return res.redirect('/login');
  } catch (err) {
    return renderError(err, next);
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy(() => res.redirect('/'));
};
