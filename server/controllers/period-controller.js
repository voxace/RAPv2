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

  // Gets student logins for specified period
  async GetStudentLoginsByPeriod(ctx) {
    let periodId = ctx.params.period;
    if (ctx.params.period == "active") {
      await Admin.GetCurrent()
      .then(currentPeriod => {
        periodId = currentPeriod[0]._id;
      });
    }
    await Period.GetStudentLoginsByPeriod(periodId)
      .then(students => {
        ctx.body = JSON.stringify(students);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Creates a new RAP Period
  async NewRapPeriod(ctx) {
    
    // Query highest order
    let latestPeriod = await Period.LatestPeriod();

    // Increment order
    let newIndex = Number(latestPeriod.order) + 1;

    // Get old values for year, term, week
    let oldYear = latestPeriod.year;
    let oldTerm = latestPeriod.term;
    let oldWeek = latestPeriod.week;
    let newYear, newTerm, newWeek;

    // Increment term, week
    if(oldWeek == 9) {
      newWeek = 5;
      newTerm = oldTerm + 1;
    } else {
      newWeek = 9;
      newTerm = oldTerm;
    }

    // Increment year, term
    if(oldTerm == 4 && oldWeek == 9) {
      newTerm = 1;
      newYear = oldYear + 1;
    } else {      
      newYear = oldYear;
    }

    // Log new values
    console.log('New index: ' + newIndex);
    console.log('New Year: ' + newYear);
    console.log('New Term: ' + newTerm);
    console.log('New Week: ' + newWeek);
    
    // Pass in details to create New Period
    await Period.NewPeriod(
      newYear,
      newTerm,
      newWeek,
      newIndex
    )
      .then(activePeriod => {
        ctx.body = JSON.stringify(activePeriod);
      })
      .catch(err => {
        throw new Error(err);
      });
    
  }
};
