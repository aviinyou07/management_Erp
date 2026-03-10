const { Task } = require("../models");

exports.createTask = async (req, res) => {

  const task = await Task.create(req.body);

  res.json(task);
};

exports.getTasks = async (req, res) => {

  const tasks = await Task.findAll();

  res.json(tasks);
};

exports.updateTask = async (req, res) => {

  const { id } = req.params;

  const task = await Task.findByPk(id);

  task.status = "completed";

  await task.save();

  res.json(task);
};