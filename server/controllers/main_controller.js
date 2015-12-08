import {createHash, createSalt, generateJWT} from '../config/auth';

export default {
  getIndex(req, res) {
    res.render('main/index', { title: 'Hack Start' });
  },

  postIndex(req, res) {
    console.log(req.body);
    const salt = createSalt();
    const hash = createSalt(req.body.password, salt);
    console.log('SALT: ' + salt);
    console.log('HASH: ' + hash);
    const token = generateJWT({
      id: 1,
      username: req.body.username
    });
    res.json({token});
  },

  getAbout(req, res) {
    res.render('main/about', { title: 'About' });
  },

  getProtected(req, res) {
    res.render('main/protected', { title: 'Protected' });
  }
};
