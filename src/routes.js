const express = require('express');
const routes = express.Router();
const ProfileController = require('./controllers/ProfileController');
const JobController = require('./controllers/JobControllers');
const DashboardController = require('./controllers/DashboardController');

routes.get('/', DashboardController.index);
routes.get('/job', JobController.create);
routes.post('/job', JobController.save);
routes.post('/job/:id', JobController.update);
routes.post('/job/delete/:id', JobController.delete);
routes.get('/job/:id', JobController.show);
routes.get('/profile', ProfileController.index);
routes.post('/profile', ProfileController.update);

module.exports = routes;
