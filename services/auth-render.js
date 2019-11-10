const SIGNUP = {
  view: 'auth/signup',
  path: '/signup',
  pageTitle: 'Sign Up',
};

const LOGIN = {
  view: 'auth/login',
  path: '/login',
  pageTitle: 'Log In',
};

const RESET = {
  view: 'auth/reset',
  path: '/reset',
  pageTitle: 'Reset password',
};

module.exports = (pageName, res, errors, inputEmail, status = 200) => {
  let page;
  switch (pageName) {
    case 'signup':
      page = SIGNUP;
      break;
    case 'login':
      page = LOGIN;
      break;
    case 'reset':
      page = RESET;
      break;
    default:
      break;
  }
  const { path, pageTitle } = page;
  return res.status(status).render(page.view, {
    path, pageTitle, errors, inputEmail,
  });
};
