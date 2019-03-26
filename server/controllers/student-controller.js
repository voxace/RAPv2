const Admin = require("./../models/admin");
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

  // Get students / all (all periods, quick)
  async GetAllStudents(ctx) {
    await Student.GetAllStudents()
      .then(students => {
        ctx.body = JSON.stringify(students);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Get students / current (slower function)
  async GetAllStudentsByPeriod(ctx) {
    let periodId = ctx.params.period;
    if (ctx.params.period == "active") {
      await Admin.GetCurrent()
      .then(currentPeriod => {
        periodId = currentPeriod[0]._id;
      });
    }
    await Score.GetAllStudentsByPeriod(periodId)
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
