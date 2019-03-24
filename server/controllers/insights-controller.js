const mongoose = require("mongoose");
const Admin = require("./../models/admin");
const Average = require("./../models/average");
const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");
const async = require("async");

module.exports = {

  // Calculate all period averages
  // Todo: calc current period ave (run once an hour)
  // Todo: query for averages to draw graph

  async GetAveragesByGrade(ctx) {

    let period = [];
    let year7 = [];
    let year8 = [];
    let year9 = [];
    let year10 = [];
    let year11 = [];
    let data = { period: period, year7: year7, year8: year8, year9: year9, year10: year10, year11: year11 };
 
    let periods = await Period.find({}).sort({order: 1}).cursor();
      
    await periods
      .eachAsync(async currentPeriod => {
        
        console.log(currentPeriod);

        let periodString = 
          "W" + currentPeriod.week +
          ",T" + currentPeriod.term +
          "," + String(currentPeriod.year).substring(2, 4);

        // push data into arrays
        await period.push(periodString);
        await year7.push(Number(currentPeriod.averages.year7).toFixed(2));
        await year8.push(Number(currentPeriod.averages.year8).toFixed(2));
        await year9.push(Number(currentPeriod.averages.year9).toFixed(2));
        await year10.push(Number(currentPeriod.averages.year10).toFixed(2));
        await year11.push(Number(currentPeriod.averages.year11).toFixed(2));

      })
      .then(() => {
        console.log('Finished processing!');
        ctx.body = data;
      });
  } 

};
