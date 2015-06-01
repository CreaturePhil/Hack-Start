module.exports = {
  index: function(req, res) {
    res.render('main/index', { title: 'Hack Start' });
  },

  about: function(req, res) {
    res.render('main/about', { title: 'About' });
  },

  protected: function(req, res) {
    res.render('main/protected', { title: 'Protected' });
  }
};
