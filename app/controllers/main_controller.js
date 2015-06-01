module.exports = {
  index: function(req, res) {
    res.render('index', { title: 'Hack Start' });
  },

  about: function(req, res) {
    res.render('about', { title: 'About' });
  },

  protected: function(req, res) {
    res.render('protected', { title: 'Protected' });
  }
};
