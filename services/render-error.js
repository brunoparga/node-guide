module.exports = (err, next) => {
  const error = new Error(err);
  error.httpStatusCode = 500;
  error.msg = err.errmsg;
  next(error);
};
