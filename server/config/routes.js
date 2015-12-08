import express from 'express';

import { isAuthenticated } from './passport';

import mainController from '../controllers/main_controller';
import userController from '../controllers/user_controller';

let router = express.Router();

router.route('/')
  .get(mainController.getIndex)
  .post(mainController.postIndex);

router.route('/about')
  .get(mainController.getAbout);

router.route('/protected')
  .get(isAuthenticated, mainController.getProtected);

router.route('/login')
  .get(userController.getLogin)
  .post(userController.postLogin);

router.route('/logout')
  .get(userController.getLogout);

router.route('/signup')
  .get(userController.getSignup)
  .post(userController.postSignup);

export default router;