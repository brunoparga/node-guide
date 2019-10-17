exports.getLogin = (req, res) => {
  const isLoggedIn = req.get('Cookie').split('=')[1] === 'true';
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Log In',
    isAuthenticated: isLoggedIn,
  });
};

exports.postLogin = (_req, res) => {
  res.setHeader('Set-Cookie', 'loggedIn=true');
  res.redirect('/');
};
