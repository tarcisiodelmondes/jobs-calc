let data = [
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
];

module.exports = {
  get() {
    return data;
  },

  update(newJob) {
    data = newJob;
  },

  delete(id) {
    data = data.filter((job) => Number(job.id) !== Number(id));
  },
};
