const Teacher = require("./../models/teacher");
const async = require("async");

module.exports = {
  // Get a list of teacher's names
  async GetAllTeacherNames(ctx) {
    await Teacher.GetAllTeacherNames()
      .then(teachers => {
        ctx.body = JSON.stringify(teachers);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // Get all teacher data
  async GetAllTeacherData(ctx) {
    await Teacher.GetAllTeacherData()
      .then(teachers => {
        ctx.body = JSON.stringify(teachers);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  }
};
