/* eslint no-unused-vars: ["error", { "argsIgnorePattern": "next" }] */
module.exports = (error, req, res, next) => {
  res.status(error.httpStatusCode).render('500', {
    pageTitle: 'Internal Server Error',
    path: '500',
  });
};
