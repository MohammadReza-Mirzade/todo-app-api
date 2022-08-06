const controller = require('../controllers/auth.controller');
const { auth } = require('../middleware');
const express = require('express');
const router = express.Router();

router.use(function(req, res, next) {
  res.header(
    'Access-Control-Allow-Headers',
    'x-access-token, Origin, Content-Type, Accept');
  next();
});

router.post('/signup', [auth.returnToken], controller.signup);

router.post('/signin', [auth.returnToken], controller.signin);

module.exports =  router;