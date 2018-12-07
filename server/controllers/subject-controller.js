const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");

module.exports = {
  // Get subject / all
  async GetAllSubjects(ctx) {
    let period = ctx.params.period;
    if (ctx.params.period == "active") {
      await Period.FindActive().then(activePeriod => {
        period = activePeriod._id;
      });
    }
    await Score.GetAllSubjects(period)
      .then(students => {
        ctx.body = JSON.stringify(students);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Get subject / all
  async GetAllSubjectCodes(ctx) {
    let period = ctx.params.period;
    if (ctx.params.period == "active") {
      await Period.FindActive().then(activePeriod => {
        period = activePeriod._id;
      });
    }
    await Score.GetAllSubjectCodes(period)
      .then(students => {
        ctx.body = JSON.stringify(students);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  }
};
