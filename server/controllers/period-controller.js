const Admin = require("./../models/admin");
const Period = require("./../models/period");
const async = require("async");

module.exports = {
  // Gets the current RAP Period
  async GetCurrentRapPeriod(ctx) {
    await Admin.GetCurrent()
      .then(currentPeriod => {
        console.log(currentPeriod[0]);
        ctx.body = JSON.stringify(currentPeriod[0]);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Gets all RAP Periods
  async GetAllRapPeriods(ctx) {
    await Period.GetAllPeriods()
      .then(periods => {
        ctx.body = JSON.stringify(periods);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Sets the current RAP Period
  async SetCurrentRapPeriod(ctx) {
    await Admin.SetCurrent(ctx.request.body.id)
      .then(currentPeriod => {
        ctx.body = JSON.stringify(currentPeriod);
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
