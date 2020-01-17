const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// work out cohort from year and current period
// add property 'lastSeen' and save periodId to it, to only get active students

const StudentSchema = new Schema({
  name: String,
  username: {
    type: String,
    lowercase: true,
    trim: true
  },
  gender: String,
  student_id: {
    type: Number,
    index: { unique: true }
  },
  longTermAverage: {
    type: Number,
    default: 0
  },
  cohort: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  lastSeen: Schema.Types.ObjectId,
  password: String
});

// Find averages lower than
StudentSchema.statics.findAveragesLowerThan = function (score, cb) {
  return this.find({ longTermAverage: { $lte: score } }, cb);
};

// Find averages greater than
StudentSchema.statics.findAveragesGreaterThan = function (score, cb) {
  return this.find({ longTermAverage: { $gte: score } }, cb);
};

// Get a list of all students
StudentSchema.statics.GetAllStudents = function (cb) {
  return this.aggregate([
    {
      $project: {
        name: "$name"
      }
    },
    {
      $sort: {
        name: 1
      }
    }
  ]).exec(cb);
};

// Create New Student
StudentSchema.statics.NewStudent = function (name, username, idNum) {
  if (username == "") {
    return this.findOneAndUpdate(
      { name: name },
      { $set: { name: name, student_id: idNum } },
      { upsert: true, new: true }
    );
  } else {
    return this.findOneAndUpdate(
      { name: name },
      { $set: { name: name, username: username, student_id: idNum } },
      { upsert: true, new: true }
    );
  }
};

// Create New Student
StudentSchema.statics.NewStudentSentral = function (name, grade, gender, idNum) {
  return this.findOneAndUpdate(
    { student_id: idNum },
    { $set: { name: name, student_id: idNum, cohort: grade, gender: gender } },
    { upsert: true, new: true }
  );
};

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
