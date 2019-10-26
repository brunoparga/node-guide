exports.auth = (req, res, next) => {
  res.locals.isAuthenticated = req.user;
  if (req.user) {
    res.locals.userEmail = req.user.email;
  }
  next();
};

exports.csrf = (req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
};
