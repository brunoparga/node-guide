/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */
/* eslint no-console: ["error", { allow: ["error"] }] */

module.exports = (error, req, res, next) => {
  console.error(error);
  res.status(500).render('500', {
    pageTitle: 'Internal Server Error',
    path: '500',
    isAuthenticated: req.user,
    errorMessage: error.msg,
  });
};
