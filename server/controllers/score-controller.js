const mongoose = require("mongoose");
const Admin = require("./../models/admin");
const Average = require("./../models/average");
const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");
const json2csv = require("csvjson-json2csv");

module.exports = {
  // Get Scores / Teacher (grouped by subject code)
  async GetScoresByTeacher (ctx) {
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
  // Get Average Scores For All Students
  async GetAllStudentsAverageScore (ctx) {
    let periodId = ctx.params.period;
    await Admin.GetCurrent()
      .then(currentPeriod => {
        periodId = currentPeriod[0]._id;
      });
    await Score.GetAllStudentsAverageScore(periodId)
      .then(scores => {
        ctx.body = JSON.stringify(scores);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // Get Scores Above 4 for the Specified Term/Year
  async GetScoresAboveFour (ctx) {

    let isCsv = ctx.params.csv;
    console.log(isCsv);
    let term = ctx.params.term;
    let year = ctx.params.year;
    let period1 = await Period.find({ year: year, term: term, week: 5 });
    let period2 = await Period.find({ year: year, term: term, week: 9 });

    if (period1[0] != undefined && period2[0] != undefined) {
      let data = await Score.aggregate([
        {
          $match: {
            score: { $gte: 1 },
            studentGrade: { $gte: 7 },
            $or: [
              { periodId: new mongoose.Types.ObjectId(period1[0]._id) },
              { periodId: new mongoose.Types.ObjectId(period2[0]._id) }
            ]
          }
        },
        {
          $group: {
            _id: "$studentId",
            average: { $avg: "$score" },
            studentGrade: { $first: "$studentGrade" }
          }
        },
        {
          $match: {
            average: { $gte: 4 }
          }
        },
        {
          $lookup: {
            from: "students",
            localField: "_id",
            foreignField: "_id",
            as: "student"
          }
        },
        {
          $project: {
            name: { $arrayElemAt: ["$student.name", 0] },
            average: "$average",
            year: "$studentGrade"
          }
        },
        {
          $sort: {
            average: -1
          }
        }
      ]).exec();

      if (isCsv == 'false') {
        ctx.body = data;
      } else {
        await data.forEach(function (v) {
          delete v._id;
          v.average = Number(v.average).toFixed(2);
        });
        var csv = await json2csv(data);
        ctx.body = csv;
      }

    } else {
      ctx.body = [{
        "_id": "#",
        "name": "No students found that meet the criteria",
        "average": null,
        "year": null
      }];
    }
  },
  // Get Scores Above 4 for the Specified Term/Year
  async GetScoresAboveFourPointFive (ctx) {

    let isCsv = ctx.params.csv;
    console.log(isCsv);
    let year = ctx.params.year;
    let periodsRaw = await Period.find({ year: year });
    let periods = [];
    periodsRaw.forEach(period => {
      periods.push(new mongoose.Types.ObjectId(period._id));
    })
    console.log(periods);

    let data = await Score.aggregate([
      {
        $match: {
          score: { $gte: 1 },
          studentGrade: { $gte: 7 },
          periodId: { $in: periods }
        }
      },
      {
        $group: {
          _id: "$studentId",
          average: { $avg: "$score" },
          studentGrade: { $first: "$studentGrade" }
        }
      },
      {
        $match: {
          average: { $gte: 4.5 }
        }
      },
      {
        $lookup: {
          from: "students",
          localField: "_id",
          foreignField: "_id",
          as: "student"
        }
      },
      {
        $project: {
          name: { $arrayElemAt: ["$student.name", 0] },
          average: "$average",
          year: "$studentGrade"
        }
      },
      {
        $sort: {
          average: -1
        }
      }
    ]).exec();

    if (isCsv == 'false') {
      ctx.body = data;
    } else {
      await data.forEach(function (v) {
        delete v._id;
        v.average = Number(v.average).toFixed(2);
      });
      var csv = await json2csv(data);
      ctx.body = csv;
    }
  },
  // Get Average Scores By Year Groups
  async GetAverageScoresByYearGroup (ctx) {
    let periodId = ctx.params.period;
    await Admin.GetCurrent()
      .then(currentPeriod => {
        periodId = currentPeriod[0]._id;
      });
    await Score.GetAverageScoresByYearGroup(periodId)
      .then(scores => {
        ctx.body = JSON.stringify(scores);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // Get Average Scores Grouped By Score
  async GetAverageScoresGroupedByScore (ctx) {
    let periodId = ctx.params.period;
    await Admin.GetCurrent()
      .then(currentPeriod => {
        periodId = currentPeriod[0]._id;
      });
    await Score.GetAverageScoresGroupedByScore(periodId)
      .then(scores => {
        ctx.body = JSON.stringify(scores);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // Get Scores / Subject Code
  async GetScoresBySubjectID (ctx) {
    await Score.GetScoresBySubjectID(ctx.params.code)
      .then(scores => {
        ctx.body = JSON.stringify(scores);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // Get Scores / Subject Name
  async GetScoresBySubjectName (ctx) {

    let periodId = ctx.params.period;
    if (ctx.params.period == "active") {
      await Admin.GetCurrent()
        .then(currentPeriod => {
          periodId = currentPeriod[0]._id;
        });
    }

    let subjectIds = []
    await Subject.GetAllSubjectCodesFromName(ctx.params.name)
      .then(subjects => {
        subjects.forEach(subject => {
          subjectIds.push(subject._id)
        });
      });


    await Score.GetScoresBySubjectName(subjectIds, periodId)
      .then(scores => {
        ctx.body = JSON.stringify(scores);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // Get Scores / Student (for student, grouped by period)
  async GetScoresByStudentName (ctx) {
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
  async SetScore (ctx) {
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
  async NewScore (ctx) {
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
  async AddStudent (ctx) {
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
  // Remove Score by looking up details
  async RemoveScoreByDetails (ctx) {
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
  },
  // Remove Score by ID
  async RemoveScoreByID (ctx) {
    await Score.findOne({
      _id: ctx.params.scoreId
    })
      .remove()
      .exec()
      .then(score => {
        console.log('Deleted Score');
        ctx.body = 'Deleted Score';
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },
  // Remove Student from Period
  async RemoveStudentByPeriod (ctx) {
    let periodId = ctx.params.periodId;
    let studentId = ctx.params.studentId;
    if (periodId == "active") {
      await Admin.GetCurrent()
        .then(currentPeriod => {
          periodId = currentPeriod[0]._id;
        });
    }
    await Score.deleteMany({
      studentId: studentId,
      periodId: periodId
    })
      .then(scores => {
        console.log('Deleted Scores from studentId: ' + studentId + ', periodId: ' + periodId);
        ctx.body = 'Deleted Scores';
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  }
};
