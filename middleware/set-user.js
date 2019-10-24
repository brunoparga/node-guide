const User = require('../models/user');

module.exports = (req, _res, next) => {
  if (req.session.user) {
    User.findById(req.session.user._id)
      .then((user) => { if (user) { req.user = user; } })
      .then(() => next())
      .catch((err) => { throw new Error(err); });
  } else { next(); }
};
