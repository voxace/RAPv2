const Period = require("./../models/period");
const async = require("async");

module.exports = {
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
