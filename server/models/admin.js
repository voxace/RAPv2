const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  isRapActive: { type: Boolean },
  currentPeriod: { type: Schema.Types.ObjectId }
});


// Check if RAP is Active
AdminSchema.statics.GetActiveStatus = function(callback) {
  return this.aggregate([
    {
      $project: {
        isRapActive: "$isRapActive"
      }
    }
  ]).exec(callback);
};

// Set RAP to Active
AdminSchema.statics.ActivateRAP = function() {
  return this.findOneAndUpdate({ },
    { $set: { isRapActive: true } }
  );
};

// Set RAP to Deactivated
AdminSchema.statics.DeactivateRAP = function() {
  return this.findOneAndUpdate({ },
    { $set: { isRapActive: false } }
  );
};

// Set Current Period
AdminSchema.statics.SetCurrent = function(id, callback) {
  return this.findOneAndUpdate({ },
    { $set: { currentPeriod: id } },
    callback
  );
};

// Get Current Period
AdminSchema.statics.GetCurrent = function(callback) {
  return this.aggregate([
    // Lookup period data
    {
      $lookup: {
        from: "periods",
        localField: "currentPeriod",
        foreignField: "_id",
        as: "period"
      }
    },
    {
      $unwind: {
        path: "$period"
      }
    },
    // Project just the useful fields
    {
      $project: {
        _id: "$period._id",
        year: "$period.year",
        term: "$period.term",
        week: "$period.week"
      }
    }
  ]).exec(callback);
};

const Admin = mongoose.model("Admin", AdminSchema);

module.exports = Admin;
