const Teacher = require("./../models/teacher");
const async = require("async");

module.exports = {
  // Get teachers / all
  async GetAllTeachers(ctx) {
    await Teacher.GetAllTeachers()
      .then(teachers => {
        ctx.body = JSON.stringify(teachers);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  }
};
