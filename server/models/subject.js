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

const Subject = mongoose.model("Subject", SubjectSchema);

module.exports = Subject;
