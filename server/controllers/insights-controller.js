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

  async Test(ctx) {
    let result = [];
    let periods = await Period.find({}).sort({order: 1}).cursor();
      
    await periods
      .eachAsync(async period => {
        let data = await Score.aggregate([
          {
            $match: {
              score: { $gte: 1 },
              studentGrade: { $gte: 7 },
              periodId: new mongoose.Types.ObjectId(period._id)
            }
          },
          {
            $group: {
              _id: "$studentGrade",
              average: { $avg: "$score" }
            }
          },
          {
            $sort: {
              _id: 1
            }
          }          
        ]).exec();

        if(data.length > 0) {

          // save into database
          let count = 4.0;
          period.averages.year7 = data[0].average;
          period.averages.year8 = data[1].average;
          period.averages.year9 = data[2].average;
          period.averages.year10 = data[3].average;
          let average = data[0].average + data[1].average + data[2].average + data[3].average;
          if(data[4]) {
            period.averages.year11 = data[4].average;
            average += data[4].average;
            count = 5.0;
          }
          average = (average/count);
          period.averages.all = average;
          data.push({ "_id": "all", "average": average });
          await period.save();

          // push onto array
          await result.push(
            { 
              "period": period._id, 
              "year": period.year,
              "term": period.term,
              "week": period.week,
              "data": data
            }
          );

        }

      })
      .then(() => {
        console.log('Finished processing!');
        ctx.body = result;
      });
  }

};
