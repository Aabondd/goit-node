const { Router } = require('express');
const userController = require('../controllers/user.controller');

const userRouter = Router();

userRouter.post(
  '/register',
  userController.validateUserEmailAndPassword,
  userController.register,
);

userRouter.put(
  '/login',
  userController.validateUserEmailAndPassword,
  userController.login,
);

userRouter.patch('/logout', userController.authorize, userController.logout);

userRouter.get(
  '/current',
  userController.authorize,
  userController.getCurrentUser,
);

module.exports = userRouter;
