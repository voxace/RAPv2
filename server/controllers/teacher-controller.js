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
  },
  // Update teacher or add new teacher
  async AddOrUpdateTeacher(ctx) {
    await Teacher.NewTeacherFull(ctx.request.body)
      .then(teacher => {
        ctx.body = JSON.stringify(teacher);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
   // Remove Teacher
   async RemoveTeacher(ctx) {
    console.log('Teacher: ' + JSON.stringify(ctx.params.id));
    await Teacher.findOne({
      _id: ctx.params.id
    })
      .remove()
      .exec()
      .then(teacher => {
        console.log(JSON.stringify(teacher));
        ctx.body = JSON.stringify(teacher);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  }
};
