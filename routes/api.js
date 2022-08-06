const express = require('express');
const auth = require('./auth.routes');
const user = require('./user.routes');
const task = require('./task.routes');

const router = express.Router();

router.use('/auth', auth);
router.use('/user', user);
router.use('/task', task);


module.exports = router;