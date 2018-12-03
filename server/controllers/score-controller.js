const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");

module.exports = {
  // Get Scores / Teacher (for teacher, grouped by class, active period only)
  async GetScoresByTeacher(ctx) {
    await Score.GetScoresByTeacher(ctx.params.id)
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
