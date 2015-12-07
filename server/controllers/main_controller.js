export default {
  getIndex(req, res) {
    res.render('main/index', { title: 'Hack Start' });
  },

  getAbout(req, res) {
    res.render('main/about', { title: 'About' });
  },

  getProtected(req, res) {
    res.render('main/protected', { title: 'Protected' });
  }
};
