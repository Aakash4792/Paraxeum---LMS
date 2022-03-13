const express = require('express');
const taskController = require('../controllers/taskController');
const taskRouter = express.Router();

taskRouter.get('/taskmanager',taskController.taskmanager_get);
taskRouter.get('/taskmanager/addtask',taskController.addtask_get);
taskRouter.post('/taskmanager/addtask',taskController.addtask_post)
taskRouter.get('/taskmanager/readtask/:id/:email',taskController.readtask_get)
taskRouter.delete('/taskmanager/readtask/:id',taskController.readtask_delete)
taskRouter.post('/taskmanager/readtask/:id',taskController.updatetask)
module.exports = taskRouter;