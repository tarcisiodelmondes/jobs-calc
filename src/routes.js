const express = require('express');
const routes = express.Router();

const views = __dirname + '/views/';

const Profile = {
  data: {
    name: 'Tarcisio',
    avatar: 'https://github.com/tarcisiodelmondes.png',
    'monthly-budget': 3000,
    'days-per-week': 5,
    'hours-per-day': 5,
    'vacation-per-year': 4,
    'value-hour': 75,
  },

  controllers: {
    index(req, res) {
      return res.render(views + 'profile', { profile: Profile.data });
    },

    update(req, res) {
      const data = req.body;

      const weeksPerYear = 52;

      const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12;

      const weekTotalHours = data['hours-per-day'] * data['days-per-week'];

      const monthlyTotalHours = weekTotalHours * weeksPerMonth;

      const valueHour = data['monthly-budget'] / monthlyTotalHours;

      Profile.data = { ...Profile.data, ...req.body, 'value-hour': valueHour };
      console.log(data);

      return res.redirect('/profile');
    },
  },
};

const Job = {
  data: [
    {
      id: 1,
      name: 'Pizza todal',
      'daily-hours': 2,
      'total-hours': 1,
      createAt: Date.now(),
    },
    {
      id: 2,
      name: 'Pizza todal 24H',
      'daily-hours': 3,
      'total-hours': 47,
      createAt: Date.now(),
    },
  ],

  controllers: {
    index(req, res) {
      const updateJobs = Job.data.map((job) => {
        const remaining = Job.services.remainingDays(job);

        const status = remaining <= 0 ? 'done' : 'progress';

        return {
          ...job,
          remaining,
          status,
          budget: Job.services.calculateBudget(job, Profile.data['value-hour']),
        };
      });

      return res.render(views + 'index', { jobs: updateJobs });
    },
    save(req, res) {
      const lastId = Job.data[Job.data.length - 1]?.id || 0;
      Job.data.push({ id: lastId + 1, ...req.body, createAt: Date.now() });

      return res.redirect('/');
    },
    create(req, res) {
      return res.render(views + 'job');
    },
    show(req, res) {
      const jobId = req.params.id;

      const job = Job.data.find(({ id }) => Number(id) === Number(jobId));

      if (!job) return res.send('Job not found');

      job.budget = Job.services.calculateBudget(
        job,
        Profile.data['value-hour'],
      );

      return res.render(views + 'job-edit', { job });
    },

    update(req, res) {
      const jobId = req.params.id;

      const job = Job.data.find(({ id }) => Number(id) === Number(jobId));

      if (!job) return res.send('Job not found');

      const updatedJob = {
        ...job,
        name: req.body.name,
        'total-hours': req.body['total-hours'],
        'daily-hours': req.body['daily-hours'],
      };

      Job.data = Job.data.map((job) => {
        if (Number(job.id) === Number(jobId)) job = updatedJob;

        return job;
      });

      res.redirect('/job/' + jobId);
    },

    delete(req, res) {
      const jobId = req.params.id;

      Job.data = Job.data.filter((job) => Number(job.id) !== Number(jobId));

      return res.redirect('/');
    },
  },

  services: {
    remainingDays(job) {
      const remainingDays = (job['total-hours'] / job['daily-hours']).toFixed();
      const createDate = new Date(job.createAt);
      const dueDay = createDate.getDate() + Number(remainingDays);
      const dueDateInMs = createDate.setDate(dueDay);

      const timeDiffInMs = dueDateInMs - Date.now();

      const dayInMs = 86400000;
      const dayDiff = Math.floor(timeDiffInMs / dayInMs);

      return dayDiff;
    },

    calculateBudget: (job, valueHour) => valueHour * job['total-hours'],
  },
};

routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);
routes.get('/job/:id', Job.controllers.show);
routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

module.exports = routes;
