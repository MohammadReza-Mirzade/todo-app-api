const createError = require('http-errors');
const db = require('../models');
const bcrypt = require('bcryptjs');
const User = db.user;

exports.checkUser = (req, res) => {
  if(!req.userId) {
    return res.send({message: 'You aren\'t signed in.'});
  }
  return res.send({message: 'You are signed in.'})
};

exports.updatePassword = async (req, res, next) => {
  try {
    if (!req.body.password) return next(createError(400));
    if (req.body.password < 8 && req.body.password > 30) return next(createError(400, 'password length must be between 8 till 30 character.'))
    const user = await User.update({password: bcrypt.hashSync(req.body.password, 8)}, {
      where: {
        id: req.userId
      }
    });

    return res.send({id: user.id, username: user.username});
  } catch (e) {
    return next(createError(500, e));
  }
}