const Admin = require("./../models/admin");
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
      .then(subjects => {
        ctx.body = JSON.stringify(subjects);
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
      await Admin.GetCurrent()
      .then(currentPeriod => {
        periodId = currentPeriod[0]._id;
      });
    }
    await Score.RemoveClass(
      ctx.request.body.teacherId,
      periodId,
      ctx.request.body.subjectId
    )
      .then(() => {
        console.log("Successfully removed teacher from class");
        ctx.body = "Successfully removed teacher from class";
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Add Class
  async AddClass(ctx) {
    let periodId = ctx.request.body.periodId;
    let teacherId = ctx.request.body.teacherId;
    let subjectId = ctx.request.body.subjectId;
    if (periodId == "active") {
      await Admin.GetCurrent()
      .then(currentPeriod => {
        periodId = currentPeriod[0]._id;
      });
    }

    // get all students in class
    await Score.findOne({
      teacherId: "000000000000000000000000",
      periodId: periodId,
      subjectId: subjectId
    }).then(async result => {
      if (result) {
        // If the class has no teacher:
        await Score.find({
          teacherId: "000000000000000000000000",
          periodId: periodId,
          subjectId: subjectId
        })
          .then(async scores => {
            await scores.forEach(async score => {
              score.teacherId = teacherId;
              score.score = 0;
              await score.save();
            });
          })
          .then(() => {
            console.log("Successfully added teacher to class");
            ctx.body = "Successfully added teacher to class";
          });
      } else {
        // If the class does already have a teacher:
        await Score.find({
          teacherId: { $ne: teacherId },
          periodId: periodId,
          subjectId: subjectId
        })
          .then(async scores => {
            await scores.forEach(async score => {
              let newScore = new Score({
                studentId: score.studentId,
                teacherId: teacherId,
                periodId: periodId,
                subjectId: subjectId,
                studentGrade: score.studentGrade,
                score: 0
              });
              await newScore.save();
            });
          })
          .then(() => {
            console.log("Successfully added teacher to class");
            ctx.body = "Successfully added teacher to class";
          });
      }
    });
  }
};
