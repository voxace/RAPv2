const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
  average: {
    type: Number,
    default: 0
  }
});

// Find averages lower than
StudentSchema.statics.findAveragesLowerThan = function(score, cb) {
  return this.find({ average: { $lte: score } }, cb);
};

// Find averages greater than
StudentSchema.statics.findAveragesGreaterThan = function(score, cb) {
  return this.find({ average: { $gte: score } }, cb);
};

// Get a list of all students
StudentSchema.statics.GetAllStudents = function(cb) {
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
StudentSchema.statics.NewStudent = function(name, username, idNum) {
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

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
