exports.getLogin = (req, res) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Log In',
    isAuthenticated: req.session.loggedIn,
  });
};

exports.postLogin = (req, res) => {
  req.session.loggedIn = true;
  res.redirect('/');
};
