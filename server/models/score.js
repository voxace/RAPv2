const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ScoreSchema = new Schema(
  {
    studentId: { type: Schema.Types.ObjectId, required: true },
    teacherId: { type: Schema.Types.ObjectId, required: true },
    periodId: { type: Schema.Types.ObjectId, required: true },
    subjectId: { type: Schema.Types.ObjectId, required: true },
    studentGrade: Number,
    score: { type: Number, default: 0 }
  },
  {
    timestamps: true
  }
);

ScoreSchema.index(
  { studentId: 1, periodId: 1, subjectId: 1, teacherId: 1 },
  { name: "unique_score", unique: true }
);

// Get scores for specified period by Teacher
ScoreSchema.statics.GetScoresByTeacher = function(teacher, period, cb) {
  console.log(period);
  return this.aggregate([
    // Match only scores for specified teacher
    {
      $match: {
        teacherId: new mongoose.Types.ObjectId(teacher),
        periodId: new mongoose.Types.ObjectId(period)
      }
    },
    // Lookup subject data
    {
      $lookup: {
        from: "subjects",
        localField: "subjectId",
        foreignField: "_id",
        as: "subject"
      }
    },
    // Lookup student data
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student"
      }
    },
    // Keep only relevant fields
    {
      $project: {
        name: { $arrayElemAt: ["$student.name", 0] },
        studentId: { $arrayElemAt: ["$student._id", 0] },
        studentGrade: "$studentGrade",
        score: "$score",
        subjectCode: { $arrayElemAt: ["$subject.code", 0] },
        subjectId: { $arrayElemAt: ["$subject._id", 0] }
      }
    },
    // Remove separate student field
    {
      $project: {
        student: 0
      }
    },
    // Sort by student name
    {
      $sort: {
        name: 1
      }
    },
    //Group scores by subject
    {
      $group: {
        _id: {
          code: "$subjectCode",
          subjectId: "$subjectId"          
        },
        scores: {
          $push: "$$ROOT"
        }
      }
    },
    // Sort groups by subject
    {
      $sort: {
        _id: 1
      }
    },
    // Remove subject code from each score
    {
      $project: {
        scores: {
          subjectCode: 0,
          studentGrade: 0,
          subjectId: 0
        }
      }
    }
  ]).exec(cb);
};

// Get scores for specified Class Code
ScoreSchema.statics.GetScoresBySubjectID = function(subjectId, cb) {
  return this.aggregate([
    // Match only specified subject
    {
      $match: {
        subjectId: new mongoose.Types.ObjectId(subjectId)
      }
    },
    // Join period table
    {
      $lookup: {
        from: "periods",
        localField: "periodId",
        foreignField: "_id",
        as: "period"
      }
    },
    // Join teacher table to students table
    {
      $lookup: {
        from: "teachers",
        localField: "teacherId",
        foreignField: "_id",
        as: "teacher"
      }
    },
    // Lookup student data
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student"
      }
    },
    // Project only relevant fields
    {
      $project: {
        name: { $arrayElemAt: ["$student.name", 0] },
        teacher: { $arrayElemAt: ["$teacher.name", 0] },
        score: {
          $cond: {
            if: { $eq: ["$score", 0] },
            then: null,
            else: "$score"
          }
        },
        period: "$period"
      }
    },
    // Sort by score
    {
      $sort: {
        score: -1
      }
    },
    // Group by RAP Period
    {
      $group: {
        _id: "$period",
        average: { $avg: "$score" },
        scores: {
          $push: "$$ROOT"
        }
      }
    },
    // Remove RAP period from each score
    {
      $project: {
        scores: { period: 0 }
      }
    },
    // Sort by RAP Period
    {
      $sort: {
        "_id.year": -1,
        "_id.term": -1,
        "_id.week": -1
      }
    }
  ]).exec(cb);
};

// Get scores for specified Class Name
ScoreSchema.statics.GetScoresBySubjectName = function(subjectIds, periodId, cb) {
  console.log('subject: ' + subjectIds)
  console.log('period: ' + periodId)
  return this.aggregate([
    // Match only specified period
    {
      $match: {
        periodId: new mongoose.Types.ObjectId(periodId),
        subjectId: { $in: subjectIds }
      }
    },
    // Lookup student data
    {
      $lookup: {
        from: "subjects",
        localField: "subjectId",
        foreignField: "_id",
        as: "subject"
      }
    },    
    // Join teacher table to students table
    {
      $lookup: {
        from: "teachers",
        localField: "teacherId",
        foreignField:
         "_id",
        as: "teacher"
      }
    },
    // Lookup student data
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student"
      }
    },
    {
      $project: {
        subjectCode: { $arrayElemAt: ["$subject.code", 0] },
        studentName: { $arrayElemAt: ["$student.name", 0] },
        teacherName: { $arrayElemAt: ["$teacher.name", 0] },
        studentGrade: "$studentGrade",
        score: "$score"
      }
    },
    // Sort by RAP Period
    {
      $sort: {
        "studentGrade": 1,
        "subjectCode": 1,
        "score": -1
      }
    },
    // Group by RAP Period
    {
      $group: {
        _id: "$subjectCode",
        scores: {
          $push: "$$ROOT"
        }
      }
    },
  ]).exec(cb);
};

// Get scores for specified Class and Period
ScoreSchema.statics.GetScoresBySubjectIDandPeriodId = function(
  subjectId,
  periodId,
  cb
) {
  return this.aggregate([
    // Match only specified subject
    {
      $match: {
        subjectId: new mongoose.Types.ObjectId(subjectId),
        periodId: new mongoose.Types.ObjectId(periodId)
      }
    },
    // Join period table
    {
      $lookup: {
        from: "periods",
        localField: "periodId",
        foreignField: "_id",
        as: "period"
      }
    },
    // Join teacher table to students table
    {
      $lookup: {
        from: "teachers",
        localField: "teacherId",
        foreignField: "_id",
        as: "teacher"
      }
    },
    // Lookup student data
    {
      $lookup: {
        from: "students",
        localField: "studentId",
        foreignField: "_id",
        as: "student"
      }
    },
    // Project only relevant fields
    {
      $project: {
        name: { $arrayElemAt: ["$student.name", 0] },
        teacher: { $arrayElemAt: ["$teacher.name", 0] },
        score: {
          $cond: {
            if: { $eq: ["$score", 0] },
            then: null,
            else: "$score"
          }
        },
        period: "$period"
      }
    },
    // Sort by score
    {
      $sort: {
        score: -1
      }
    }
  ]).exec(cb);
};

// Get all scores for specified Student grouped by period
ScoreSchema.statics.GetScoresByStudentName = function(student, cb) {
  console.log(student);
  return this.aggregate([
    // Match only scores for specified student
    // Also only match scores of 1 or above to leave out empty scores
    {
      $match: {
        studentId: new mongoose.Types.ObjectId(student),
        score: { $gte: 1 }
      }
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
    // Join subject table to students table
    {
      $lookup: {
        from: "subjects",
        localField: "subjectId",
        foreignField: "_id",
        as: "subject"
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
    // Project only relevant fields
    {
      $project: {
        name: { $arrayElemAt: ["$teacher.name", 0] },
        score: {
          $cond: {
            if: { $eq: ["$score", 0] },
            then: null,
            else: "$score"
          }
        },
        subject: { $arrayElemAt: ["$subject.name", 0] },
        subjectCode: { $arrayElemAt: ["$subject.code", 0] },
        period: "$period"
      }
    },
    // Group by RAP Period
    {
      $group: {
        _id: "$period",
        average: { $avg: "$score" },
        scores: {
          $push: "$$ROOT"
        }
      }
    },
    // Remoev RAP period from each score
    {
      $project: {
        scores: { period: 0 }
      }
    },
    // Sort by RAP Period
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
  grade,
  score,
  callback
) {
  return this.findOneAndUpdate(
    {
      studentId: student,
      teacherId: teacher,
      periodId: period,
      subjectId: subject,
      studentGrade: grade
    },
    {
      $set: {
        studentId: student,
        teacherId: teacher,
        periodId: period,
        subjectId: subject,
        studentGrade: grade,
        score: score
      }
    },
    { upsert: true, new: true },
    callback
  );
};

// Create New Score
ScoreSchema.statics.AddStudent = function(
  student,
  teacher,
  period,
  subject,
  grade,
  score,
  callback
) {
  return this.findOneAndUpdate(
    {
      studentId: student,
      teacherId: teacher,
      periodId: period,
      subjectId: subject,
      studentGrade: grade
    },
    {
      $set: {
        studentId: student,
        teacherId: teacher,
        periodId: period,
        subjectId: subject,
        studentGrade: grade,
        score: score
      }
    },
    { upsert: false, new: false },
    callback
  );
};

// Remove Class from Teacher
ScoreSchema.statics.RemoveClass = async function(
  teacher,
  period,
  subject,
  callback
) {
  let others = false;
  await this.findOne(
    {
      teacherId: { $ne: teacher },
      periodId: period,
      subjectId: subject
    },
    async function(err, subject) {
      if (subject) {
        others = true;
      }
    }
  );

  if (others == false) {
    // If class has no other teacher, set teacher to null
    console.log("Class teacher set to null");
    return this.updateMany(
      {
        teacherId: teacher,
        periodId: period,
        subjectId: subject
      },
      {
        teacherId: "000000000000000000000000",
        score: 0
      },
      callback
    );
  } else {
    // Delete class because it has another teacher
    console.log("Class teacher deleted");
    return this.deleteMany(
      {
        teacherId: teacher,
        periodId: period,
        subjectId: subject
      },
      callback
    );
  }
};

const Score = mongoose.model("Score", ScoreSchema);

module.exports = Score;
