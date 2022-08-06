const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');

verifyToken = (req, res, next) => {
  let token = req.headers['authorization']?.replace('Bearer ', '');

  if (!token) {
    return res.status(403).send({
      message: 'No token provided!'
    });
  }

  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: 'Unauthorized!'
      });
    }
    req.userId = decoded.id;
    return next();
  });
};

returnToken = (req, res, next) => {
  let token = req.headers['authorization']?.replace('Bearer ', '');
  if (!token) {
    req.userId = null;
    return next();
  }
  jwt.verify(token, config.SECRET, (err, decoded) => {
    if (err || !decoded) {
      req.userId = null;
      return next();
    }
    req.userId = decoded.id;
    return next();
  });
};

const authJwt = {
  verifyToken,
  returnToken,
};

module.exports = authJwt;