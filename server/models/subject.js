const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SubjectSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, required: true }
});

SubjectSchema.index(
  { name: 1, code: 1 },
  { name: "unique_subject", unique: true }
);

// Create New Teacher
SubjectSchema.statics.NewSubject = function(name, code, callback) {
  return this.findOneAndUpdate(
    { name: name, code: code },
    { $set: { name: name, code: code } },
    { upsert: true, new: true },
    callback
  );
};

// Get a list of all subjects by name
SubjectSchema.statics.GetAllSubjects = function(cb) {
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

// Get a list of all subjects by code
SubjectSchema.statics.GetAllSubjectCodes = function(cb) {
  return this.aggregate([
    {
      $project: {
        code: "$code"
      }
    },
    {
      $sort: {
        code: 1
      }
    }
  ]).exec(cb);
};

const Subject = mongoose.model("Subject", SubjectSchema);

module.exports = Subject;
