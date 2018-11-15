const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Utilities = require("./admin-utilities");
const csv = require("csvtojson");
const async = require("async");
const fs = require("fs");

module.exports = {
  // Imports timetable data from Edval in CSV format
  async ImportFromEdval(ctx) {
    let csvFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = await csv().fromFile(csvFilePath);
    Utilities.ProcessStudents(jsonArrayObj, ctx);
    Utilities.DeleteFile(csvFilePath);
  },

  // Gets the active RAP Period
  async GetActiveRapPeriod(ctx) {
    await Period.FindActive()
      .then(activePeriod => {
        ctx.body = JSON.stringify(activePeriod);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Sets the active RAP Period
  async SetActiveRapPeriod(ctx) {
    // Set any active periods to 'active:false' first
    await Period.SetNoneActive();
    // Then set specified period to 'active::true'
    await Period.SetActive(
      ctx.request.body.year,
      ctx.request.body.term,
      ctx.request.body.week
    )
      .then(activePeriod => {
        // Return the active period document
        ctx.body = JSON.stringify(activePeriod);
      })
      .catch(err => {
        throw new Error(err);
      });
  },

  // Creates a new RAP Period
  async NewRapPeriod(ctx) {
    await Period.NewPeriod(
      ctx.request.body.year,
      ctx.request.body.term,
      ctx.request.body.week
    )
      .then(activePeriod => {
        ctx.body = JSON.stringify(activePeriod);
      })
      .catch(err => {
        throw new Error(err);
      });
  }
};
