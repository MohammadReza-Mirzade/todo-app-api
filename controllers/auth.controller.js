const createError = require('http-errors');
const { user } = require('../models');
const config = require('../config/auth.config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.signup = async (req, res, next) => {
  try {
    if (!req.body.password || !req.body.username) return next(createError(400));
    if (req.body.password.length < 8 || req.body.password.length > 30) return next(createError(400, 'password length must be between 8 till 30 character.'))
    if (req.body.username.length < 8 || req.body.username.length > 30) return next(createError(400, 'username length must be between 8 till 30 character.'))

    if (req.userId) return res.send({message: 'You are already signed in.'})

    const foundUser = await user.findOne({
      attributes: ['id'],
      where: {
        username: req.body.username
      }
    });
    if (foundUser) return next(createError(400, 'This username already in use.'));
    const newUser = await user.create({
      username: req.body.username,
      password: bcrypt.hashSync(req.body.password, 8)
    });
    return res.send({username: newUser.username})
  } catch (e) {
    return next(createError(500, e));
  }
};

exports.signin = async (req, res, next) => {
  try {
    if (!req.body.password || !req.body.username) return next(createError(400));

    if (req.userId) return res.send({message: 'You are already signed in.'})

    const foundUser = await user.findOne({
      where: {
        username: req.body.username
      }
    });

    if (!user) return next(createError(404, 'Username or password is invalid.'));

    let passwordIsValid = bcrypt.compare(
      req.body.password,
      foundUser.password,
    );

    if (!passwordIsValid) {
      return next(createError(404, 'Username or password is invalid.'));
    }

    let token = jwt.sign({id: foundUser.id}, config.SECRET, {
      expiresIn: config.EXPIRES_IN
    });

    res.send({
      id: foundUser.id,
      username: foundUser.username,
      accessToken: token,
    });
  } catch (e) {
    return next(createError(500, e));
  }
};