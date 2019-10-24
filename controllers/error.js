exports.get404 = (_req, res) => {
  res.status(404).render('404', {
    pageTitle: 'Page Not Found',
    path: '404',
  });
};

exports.get500 = (_req, res) => {
  res.status(500).render('500', {
    pageTitle: 'Internal Server Error',
    path: '500',
  });
};
