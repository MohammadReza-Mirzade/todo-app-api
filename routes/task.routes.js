const controller = require('../controllers/task.controller')
const {auth} = require('../middleware');
const express = require('express');
const router = express.Router();

router.get('/', [auth.verifyToken], controller.findAll);
router.get('/:taskId', [auth.verifyToken], controller.findOne);
router.post('/', [auth.verifyToken], controller.create);
router.put('/:taskId', [auth.verifyToken], controller.update);
router.delete('/:taskId', [auth.verifyToken], controller.delete);

module.exports = router;