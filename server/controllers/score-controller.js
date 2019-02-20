const Admin = require("./../models/admin");
const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");

module.exports = {
  // Get Scores / Teacher (grouped by subject code)
  async GetScoresByTeacher(ctx) {
    let periodId = ctx.params.period;
    if (ctx.params.period == "active") {
      await Admin.GetCurrent()
      .then(currentPeriod => {
        periodId = currentPeriod[0]._id;
      });
    }
    await Score.GetScoresByTeacher(ctx.params.id, periodId)
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
  },
  // New Score from all details
  async NewScore(ctx) {
    let studentId = ctx.request.body.studentId;
    let teacherId = ctx.request.body.teacherId;
    let subjectId = ctx.request.body.subjectId;
    let studentGrade = ctx.request.body.studentGrade;
    let periodId = ctx.params.period;
    if (ctx.request.body.periodId == "active") {
      await Admin.GetCurrent()
      .then(currentPeriod => {
        periodId = currentPeriod[0]._id;
      });
    }
    await Score.NewScore(
      studentId,
      teacherId,
      periodId,
      subjectId,
      studentGrade,
      0
    )
      .then(score => {
        console.log(JSON.stringify(score));
        ctx.body = JSON.stringify(score);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // New Score from all details
  async AddStudent(ctx) {
    let periodId = ctx.params.period;
    if (ctx.request.body.periodId == "active") {
      await Admin.GetCurrent()
      .then(currentPeriod => {
        periodId = currentPeriod[0]._id;
      });
    }
    let score = new Score({
      studentId: ctx.request.body.studentId,
      teacherId: ctx.request.body.teacherId,
      subjectId: ctx.request.body.subjectId,
      studentGrade: ctx.request.body.studentGrade,
      periodId: periodId,
      score: 0
    });

    await score
      .save()
      .then(score => {
        console.log(JSON.stringify(score));
        ctx.body = JSON.stringify(score);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // Remove Score
  async RemoveStudent(ctx) {
    let periodId = ctx.request.body.periodId;
    if (periodId == "active") {
      await Admin.GetCurrent()
      .then(currentPeriod => {
        periodId = currentPeriod[0]._id;
      });
    }
    await Score.findOne({
      studentId: ctx.request.body.studentId,
      teacherId: ctx.request.body.teacherId,
      subjectId: ctx.request.body.subjectId,
      periodId: periodId
    })
      .remove()
      .exec()
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
