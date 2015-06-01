module.exports = {
  getIndex: function(req, res) {
    res.render('main/index', { title: 'Hack Start' });
  },

  getAbout: function(req, res) {
    res.render('main/about', { title: 'About' });
  },

  getProtected: function(req, res) {
    res.render('main/protected', { title: 'Protected' });
  }
};
