const express = require('express');
const lessonController = require('../controllers/lessonController');
const lessonsRouter = express.Router();

lessonsRouter.get('/lessons/0',lessonController.l0_get);
lessonsRouter.get('/lessons/1',lessonController.l1_get);
lessonsRouter.get('/lessons/2',lessonController.l2_get);
lessonsRouter.get('/lessons/3',lessonController.l3_get);
lessonsRouter.post('/lessons/:id',lessonController.li_post);

module.exports = lessonsRouter;