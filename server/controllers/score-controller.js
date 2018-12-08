const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");

module.exports = {
  // Get Scores / Teacher (grouped by subject code)
  async GetScoresByTeacher(ctx) {
    let period = ctx.params.period;
    if (ctx.params.period == "active") {
      await Period.FindActive().then(activePeriod => {
        period = activePeriod._id;
      });
    }
    await Score.GetScoresByTeacher(ctx.params.id, period)
      .then(scores => {
        ctx.body = JSON.stringify(scores);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // Get Scores / Subject
  async GetScoresBySubjectID(ctx) {
    await Score.GetScoresBySubjectID(ctx.params.code)
      .then(scores => {
        ctx.body = JSON.stringify(scores);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // Get Scores / Student (for student, grouped by period)
  async GetScoresByStudentName(ctx) {
    await Score.GetScoresByStudentName(ctx.params.name)
      .then(scores => {
        ctx.body = JSON.stringify(scores);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // Update Score / ID (when giving the student a score)
  async SetScore(ctx) {
    let id = ctx.request.body.id;
    let score = ctx.request.body.score;
    await Score.SetScore(id, score)
      .then(score => {
        ctx.body = JSON.stringify(score);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  }
};
