const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");

module.exports = {
  // Get subject / name / all
  async GetAllSubjects(ctx) {
    await Subject.GetAllSubjects()
      .then(students => {
        ctx.body = JSON.stringify(students);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Get subject / code / all
  async GetAllSubjectCodes(ctx) {
    await Subject.GetAllSubjectCodes()
      .then(students => {
        ctx.body = JSON.stringify(students);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Remove Class
  async RemoveClass(ctx) {
    let periodId = ctx.request.body.periodId;
    if (periodId == "active") {
      await Period.FindActive().then(activePeriod => {
        periodId = activePeriod._id;
      });
    }
    await Score.RemoveClass(
      ctx.request.body.teacherId,
      periodId,
      ctx.request.body.subjectId
    )
      .then(score => {
        console.log(JSON.stringify(score));
        ctx.body = JSON.stringify(score);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  }
};
