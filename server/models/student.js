const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StudentSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  username: {
    type: String,
    lowercase: true
  },
  gender: String,
  student_id: {
    type: Number,
    index: { unique: true }
  },
  average: Number
});

StudentSchema.statics.findAveragesLowerThan = function(score, cb) {
  return this.find({ average: { $lte: score } }, cb);
};

StudentSchema.statics.findAveragesGreaterThan = function(score, cb) {
  return this.find({ average: { $gte: score } }, cb);
};

// Create New Teacher
StudentSchema.statics.NewStudent = function(first, last, callback) {
  return this.findOneAndUpdate(
    { name: { first: first, last: last } },
    { $set: { name: { first: first, last: last } } },
    { upsert: true, new: true },
    callback
  );
};

StudentSchema.virtual("fullName")
  .get(function() {
    return this.name.first + " " + this.name.last;
  })
  .set(function(v) {
    this.name.first = v.substr(0, v.indexOf(" "));
    this.name.last = v.substr(v.indexOf(" ") + 1);
  });

const Student = mongoose.model("Student", StudentSchema);

module.exports = Student;
