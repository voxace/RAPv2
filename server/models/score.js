const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreSchema = new Schema(
  {
    studentId: Schema.Types.ObjectId,
    teacherId: Schema.Types.ObjectId,
    periodId: Schema.Types.ObjectId,
    subject: String,
    subjectCode: String,
    studentGrade: Number,
    score: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

// Get scores for specified period by Teacher
ScoreSchema.statics.GetScoresByTeacher = function(teacher, cb) {
  return this.aggregate([
    // Match only scores for specified teacher
    {
      $match: { teacherId: new mongoose.Types.ObjectId(teacher) }
    },
    // Join score table to students table
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student"
      }
    },
    // Merge student field data back into score
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$student", 0] }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        name: "$name",
        studentId: "$studentId",
        score: "$score",
        subjectCode: "$subjectCode"
      }
    },
    // Remove separate student field
    {
      $project: {
        student: 0
      }
    },
    {
      $sort: {
        name: 1
      }
    },
    // Group scores by subject
    {
      $group: {
        _id: "$subjectCode",
        scores: {
          $push: "$$ROOT"
        }
      }
    },
    {
      $sort: {
        _id: 1
      }
    },
    {
      $project: {
        scores: { subjectCode: 0 }
      }
    }
  ]).exec(cb);
};

// Get all scores for specified Student grouped by period
ScoreSchema.statics.GetScoresByStudentName = function(student, cb) {
  console.log(student);
  return this.aggregate([
    // Match only scores for specified teacher
    {
      $match: { studentId: new mongoose.Types.ObjectId(student) }
    },
    // Join score table to students table
    {
      $lookup: {
        from: "periods",
        localField: "periodId",
        foreignField: "_id",
        as: "period"
      }
    },
    // Join score table to students table
    {
      $lookup: {
        from: "teachers",
        localField: "teacherId",
        foreignField: "_id",
        as: "teacher"
      }
    },
    // Merge teacher field data back into score
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: [{ $arrayElemAt: ["$teacher", 0] }, "$$ROOT"]
        }
      }
    },
    {
      $project: {
        name: "$name",
        score: "$score",
        subject: "$subject",
        subjectCode: "$subjectCode",
        period: "$period"
      }
    },
    {
      $group: {
        _id: "$period",
        scores: {
          $push: "$$ROOT"
        }
      }
    },
    {
      $project: {
        scores: { period: 0 }
      }
    },
    {
      $sort: {
        "_id.year": -1,
        "_id.term": -1,
        "_id.week": -1
      }
    }
  ]).exec(cb);
};

// Find scores less than
ScoreSchema.statics.findScoresLessThan = function(score, cb) {
  return this.find({ average: { $lt: score } }, cb);
};

// Find scores less than or equal to
ScoreSchema.statics.findScoresLessThanOrEqualTo = function(score, cb) {
  return this.find({ average: { $lte: score } }, cb);
};

// Find scores greater than
ScoreSchema.statics.findScoresGreaterThan = function(score, cb) {
  return this.find({ average: { $gt: score } }, cb);
};

// Find scores greater than or equal to
ScoreSchema.statics.findScoresGreaterThanOrEqualTo = function(score, cb) {
  return this.find({ average: { $gte: score } }, cb);
};

// Get student's long-term average
ScoreSchema.statics.GetStudentLongTermAverage = function(student, cb) {
  return ScoreSchema.aggregate([
    {
      $match: { studentId: student },
      $group: {
        _id: student,
        average: { $avg: "$score" }
      }
    }
  ]).exec(cb);
};

// Get student's average for the specified period
ScoreSchema.statics.GetStudentPeriodAverage = function(student, period, cb) {
  return ScoreSchema.aggregate([
    {
      $match: { studentId: student, periodId: period },
      $group: {
        _id: student,
        average: { $avg: "$score" }
      }
    }
  ]).exec(cb);
};

// Set Score
ScoreSchema.statics.SetScore = function(id, score, callback) {
  console.log("id: " + id);
  console.log("score: " + score);
  return this.findOneAndUpdate(
    {
      _id: new mongoose.Types.ObjectId(id)
    },
    {
      $set: { score: score }
    },
    {
      new: true
    },
    callback
  );
};

// Create New Score
ScoreSchema.statics.NewScore = function(
  student,
  teacher,
  period,
  subject,
  code,
  grade,
  score,
  callback
) {
  return this.findOneAndUpdate(
    {
      studentId: student,
      teacherId: teacher,
      periodId: period,
      subject: subject,
      subjectCode: code,
      studentGrade: grade
    },
    {
      $set: {
        studentId: student,
        teacherId: teacher,
        periodId: period,
        subject: subject,
        subjectCode: code,
        studentGrade: grade,
        score: score
      }
    },
    { upsert: true, new: true },
    callback
  );
};

const Score = mongoose.model("Score", ScoreSchema);

module.exports = Score;
