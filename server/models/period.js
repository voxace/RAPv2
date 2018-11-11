const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PeriodSchema = new Schema({
  year: { type: Number, required: true },
  term: { type: Number, required: true },
  week: { type: Number, required: true },
  active: Boolean,
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

// Get Active Period
PeriodSchema.statics.FindActive = function() {
  return this.findOne({ active: true });
};

// Set Active Period
PeriodSchema.statics.NewPeriod = function(year, term, week, callback) {
  return this.findOneAndUpdate(
    { year: year, term: term, week: week },
    { $set: { year: year, term: term, week: week } },
    { upsert: true },
    callback
  );
};

// Remove All Active Periods
PeriodSchema.statics.SetNoneActive = function() {
  return this.update(
    { active: true },
    { $set: { active: false } },
    { multi: true }
  );
};

// Set Active Period
PeriodSchema.statics.SetActive = function(year, term, week, callback) {
  return this.findOneAndUpdate(
    { year: year, term: term, week: week },
    { $set: { active: true } },
    { new: true },
    callback
  );
};

const Period = mongoose.model("Period", PeriodSchema);

module.exports = Period;
