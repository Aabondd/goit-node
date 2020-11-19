const Joi = require('joi');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

Joi.objectId = require('joi-objectid')(Joi);
const {
  Types: { ObjectId },
} = require('mongoose');
const {
  UnauthorizedError,
  NotFoundError,
} = require('../errors/errors.constructors');

const userModel = require('../models/user.model');

class UserController {
  constructor() {
    this._costFactor = 4;
  }

  get register() {
    return this._register.bind(this);
  }

  get getCurrentUser() {
    return this._getCurrentUser.bind(this);
  }

  get login() {
    return this._login;
  }

  async _register(req, res, next) {
    try {
      const { password, email } = req.body;
      const passwordHash = await bcryptjs.hash(password, this._costFactor);

      const existingUser = await userModel.findUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: 'Email in use',
        });
      }

      const user = await userModel.create({
        email,
        password: passwordHash,
      });

      return res.status(201).json({
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async _login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await userModel.findUserByEmail(email);
      if (!user) {
        throw new NotFoundError('Email or password is wrong');
      }

      const isPasswordValid = await bcryptjs.compare(password, user.password);
      if (!isPasswordValid) {
        throw new NotFoundError('Email or password is wrong');
      }

      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60, // two days
      });
      await userModel.updateToken(user._id, token);

      return res.status(200).json({
        token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      const user = req.user;
      await userModel.updateToken(user._id, null);

      return res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async _getCurrentUser(req, res, next) {
    const [userForResponse] = this.prepareUsersResponse([req.user]);

    return res.status(200).json(userForResponse);
  }

  async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get('Authorization') || '';
      const token = authorizationHeader.replace('Bearer ', '');

      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        // console.log(err);
        // next(new UnauthorizedError('Not authorized'));
        next(res.status(401).json({ message: 'Not authorized' }));
      }

      const user = await userModel.findById(userId);

      if (!user || user.token !== token) {
        // res.status(401).json({ message: 'Not authorized' });
        throw new UnauthorizedError('Not authorized');
      }

      req.user = user;
      req.token = token;

      next();
    } catch (err) {
      next(err);
    }
  }

  validateUserEmailAndPassword(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });

    const validationResult = Joi.validate(req.body, signInRules);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error);
    }

    next();
  }

  prepareUsersResponse(users) {
    return users.map(user => {
      const { email, password, subscription, token } = user;

      return { email, subscription };
    });
  }
}

module.exports = new UserController();
