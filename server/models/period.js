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

// Get the details of the latest period (by order)
PeriodSchema.statics.LatestPeriod = function(callback) {
  return this.findOne({ order: { $gte: 0 }})
    .sort('-order')
    .exec(callback);
};

// New Period
PeriodSchema.statics.NewPeriod = function(year, term, week, order, callback) {
  return this.findOneAndUpdate(
    { year: year, term: term, week: week },
    { $set: { year: year, term: term, week: week, order: order } },
    { upsert: true },
    callback
  );
};

const Period = mongoose.model("Period", PeriodSchema);

module.exports = Period;
