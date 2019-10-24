/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */
module.exports = (error, req, res, next) => {
  res.status(500).render('500', {
    pageTitle: 'Internal Server Error',
    path: '500',
    isAuthenticated: req.user,
    errorMessage: error.msg,
  });
};
