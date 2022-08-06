const { Op } = require('sequelize');
const createError = require('http-errors');
const db = require('../models');
const Task = db.task;

exports.findOne = async (req, res, next) => {
  try {
    if(!+req.params.taskId) return next(createError(400));

    const task = await Task.findOne({
      where: {id: req.params.taskId}
    })
    if (!task || task.userId !== req.userId) return next(createError(404, 'Task didn\'t found.'));
    return res.send(task);
  } catch (e) {
    return next(createError(500, e));
  }
};

exports.findAll = async (req, res, next) => {
  try {
    let {page, limit, search} = req.query;
    page = page || 1;
    limit = limit || 10;

    let where = {};
    if (search) {
      where = {
        [Op.or]: [
          {title: {[Op.substring]: search}},
          {body: {[Op.substring]: search}}
        ],
      };
    }
    const tasks = await Task.findAll({
      limit: +limit,
      offset: (+page - 1) * +limit,
      attributes: ['id', 'title'],
      where: {
        userId: req.userId,
        ...where,
      }
    });

    return res.send({tasks, page: page, limit: limit});
  } catch (e) {
    return next(createError(500, e));
  }
};

exports.create = async (req, res, next) => {
  try {
    if (!req.body.title || !req.body.body) return next(createError(400));

    const task = await Task.create({userId: req.userId, title: req.body.title, body: req.body.body});
    return res.send({task});
  } catch (e) {
    return next(createError(500, e));
  }
};

exports.update = async (req, res, next) => {
  try {
    const { title, body } = req.body;
    const { taskId } = req.params;
    if (!+taskId) return next(createError(400));
    const task = await Task.findOne({where: {id: taskId}});
    if (!task || task.userId !== req.userId) return next(createError(404, 'Task didn\'t found.'));
    await Task.update({
      title: title,
      body: body,
    }, {
      where: {
        id: +taskId,
      }
    });
    const newTask = await Task.findOne({where: {id: taskId}});
    return res.send({task: newTask});
  } catch (e) {
    return next(createError(500, e));
  }
}

exports.delete = async (req, res, next) => {
  try {
    const {taskId} = req.params;
    if (!+taskId) return next(createError(400));
    const task = await Task.findOne({where: {id: taskId}});
    if (!task || task.userId !== req.userId) return next(createError(404, 'Task didn\'t found.'));
    await Task.destroy({where: {id: taskId}});
    return res.send({message: 'Your task successfully deleted.'});
  } catch (e) {
    return next(createError(500, e));
  }
};