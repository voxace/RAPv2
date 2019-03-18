const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PeriodSchema = new Schema({
  year: { type: Number, required: true },
  term: { type: Number, required: true },
  week: { type: Number, required: true },
  order: { type: Number },
  averages: {
    all: Number,
    year7: Number,
    year8: Number,
    year9: Number,
    year10: Number
  }
});

// Ensure each RAP Period is unique
PeriodSchema.index({ year: 1, term: 1, week: 1 }, { unique: true });

// Get all periods in order
PeriodSchema.statics.GetAllPeriods = function(cb) {
  return this.aggregate([
    {
      $project: {
        year: "$year",
        term: "$term",
        week: "$week"
      }
    },
    {
      $sort: {
        year: -1,
        term: -1,
        week: -1
      }
    }
  ]).exec(cb);
};

// New Period
PeriodSchema.statics.NewPeriod = function(year, term, week, callback) {
  return this.findOneAndUpdate(
    { year: year, term: term, week: week },
    { $set: { year: year, term: term, week: week } },
    { upsert: true },
    callback
  );
};

const Period = mongoose.model("Period", PeriodSchema);

module.exports = Period;
