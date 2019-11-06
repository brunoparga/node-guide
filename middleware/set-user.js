const User = require('../models/user');

module.exports = async (req, _res, next) => {
  if (req.session.user) {
    try {
      const user = await User.findById(req.session.user._id);
      if (user) {
        req.user = user;
      }
    } catch (err) {
      throw new Error(err);
    }
  }
  next();
};
