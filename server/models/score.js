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
    score: Number
  },
  {
    timestamps: true
  }
);

ScoreSchema.statics.findScoresLowerThan = function(score, cb) {
  return this.find({ average: { $lte: score } }, cb);
};

ScoreSchema.statics.findScoresGreaterThan = function(score, cb) {
  return this.find({ average: { $gte: score } }, cb);
};

ScoreSchema.statics.GetStudentPeriodAverage = function(student, cb) {
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

// Create New Score
ScoreSchema.statics.NewScore = function(
  student,
  teacher,
  period,
  subject,
  code,
  grade,
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
        studentGrade: grade
      }
    },
    { upsert: true, new: true },
    callback
  );
};

const Score = mongoose.model("Score", ScoreSchema);

module.exports = Score;
