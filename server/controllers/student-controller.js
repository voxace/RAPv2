const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");

module.exports = {
  // Add student / by name

  // Delete student / by ID
  // Delete student / by name

  // Get student / by ID
  // Get student / by name
  // Get student / by username

  // Get students / all
  async GetAllStudents(ctx) {
    let period = ctx.params.period;
    if (ctx.params.period == "active") {
      await Period.FindActive().then(activePeriod => {
        period = activePeriod._id;
      });
    }
    await Student.GetAllStudents(period)
      .then(students => {
        ctx.body = JSON.stringify(students);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Get students / by gender
  // Get students / by long term average

  async post(ctx) {
    ctx.body = "User POST";
  },

  async get(ctx) {
    ctx.body = "User GET";
  },

  async put(ctx) {
    ctx.body = "User PUT";
  },

  async delete(ctx) {
    ctx.body = "User DELETE";
  }
};
