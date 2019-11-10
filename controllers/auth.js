require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mailer = require('@sendgrid/mail');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const render = require('../services/auth-render');
const renderError = require('../services/render-error');

mailer.setApiKey(process.env.SENDGRID_API_KEY);

const validateCredentials = (req, res, view) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let inputEmail;
    if (errors.array().every((error) => error.param !== 'email')) {
      inputEmail = req.body.email;
    }
    render(view, res, errors.array(), inputEmail, 422);
    return false;
  }
  return true;
};

const signup = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  await new User({ email, password: hashedPassword, cart: { items: [] } }).save();
  await mailer.send({
    to: email,
    from: 'welcome@superstore.com',
    subject: 'Welcome to the Amazon-Killer!',
    html: '<h1>Hi there!!!!</h1>',
  });
};

exports.getSignup = (req, res) => render('signup', res, req.flash('error'), '');

exports.postSignup = async (req, res, next) => {
  const passedValidation = validateCredentials(req, res, 'signup');
  if (!passedValidation) {
    return;
  }
  const { email, password } = req.body;
  try {
    await signup(email, password);
    res.redirect('/login');
  } catch (err) {
    renderError(err, next);
  }
};

exports.getLogin = (req, res) => render('login', res, req.flash('error'), '');

exports.postLogin = async (req, res, next) => {
  const passedValidation = validateCredentials(req, res, 'login');
  if (!passedValidation) {
    return;
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const match = await bcrypt.compare(password, user.password);
    if (user && match) {
      req.session.user = user;
      req.session.save(() => res.redirect('/'));
    } else {
      render('login', res, [{ msg: 'Invalid email or password.' }], email, 422);
    }
  } catch (err) {
    renderError(err, next);
  }
};

exports.getReset = (req, res) => render('reset', res, req.flash('error'), '');

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, async (error, buffer) => {
    if (error) {
      render('reset', res, [
        { msg: 'There was a server error; please try again.' },
      ], '');
      return;
    }
    const token = buffer.toString('hex');
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        render('reset', res, [{ msg: 'Email not found.' }], req.body.email, 422);
        return;
      }
      user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 3600000;
      await user.save();
      res.redirect('/');
      mailer.send({
        to: req.body.email,
        from: 'recovery@superduperstore.com',
        subject: 'Recover your password',
        html: `
            <p>Someone (likely you) requested a password reset for this email.</p>
            <p>Click <a href="https://superduperstore.herokuapp.com/new-password/${token}">this link</a> to reset your password.</p>

            Cheers,<br>
            SuperDuperStore.com
          `,
      });
    } catch (err) {
      renderError(err, next);
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
        errors: req.flash('error'),
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
    req.flash('error', { msg: "The passwords don't match." });
    return res.redirect(`/new-password/${resetToken}`);
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
