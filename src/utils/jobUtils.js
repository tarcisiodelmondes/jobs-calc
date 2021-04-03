module.exports = {
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
};
