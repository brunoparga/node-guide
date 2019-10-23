const User = require('../models/user');

module.exports = (req, _res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id).then((user) => {
      req.user = user;
      next();
    });
  } else {
    next();
  }
};
