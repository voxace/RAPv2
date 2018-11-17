const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");

module.exports = {
  async GetScoresByTeacher(ctx) {
    await Score.GetScoresByTeacher("5be7f030a5de53e0d4d97d23")
      .then(scores => {
        ctx.body = JSON.stringify(scores);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  }
};
