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

  // Calculates each student average for each period
  // WARNING: Results are stored in and OVERWRITE the 'averages' table
  async CalculateAllPeriodAverages(ctx) {
    let data = await Score.aggregate([
      {
        $match: {
          score: { $gte: 1 },
          studentGrade: { $gte: 7 }
        }
      },
      {
        $group: {
          _id: { studentId: "$studentId", periodId: "$periodId" },
          average: { $avg: "$score" },
          studentGrade: { $first: "$studentGrade" }
        }
      },
      {
        $out: "averages"
      } 
    ]).exec();
    ctx.body = "Averages Processed";
  },

  // Calculate current averages
  async CalculateCurrentPeriodAverages() {
    console.log("Calculating Student Averages...");
    let period = await Admin.GetCurrent();
    let data = await Score.aggregate([
      {
        $match: {
          score: { $gte: 1 },
          studentGrade: { $gte: 7 },
          periodId: new mongoose.Types.ObjectId(period[0]._id)
        }
      },
      {
        $group: {
          _id: { studentId: "$studentId", periodId: "$periodId" },
          average: { $avg: "$score" },
          studentGrade: { $first: "$studentGrade" }
        }
      }
    ]).exec();

    await async.eachSeries(data, function(currentItem, callback) {
      Average.NewAverage(
        { "studentId": currentItem._id.studentId, "periodId": currentItem._id.periodId }, 
        currentItem.average, currentItem.studentGrade)
        .then(result => {
          //console.log(result._id.studentId + ': ' + result.average);
          callback();
        });
    },
    function(err) {
      if (err) {
        throw new Error(err);
      } else {
        console.log("Student Averages Calculated Successfully");
        module.exports.CalculateYearGroupAverages();
      }
    });
    
  },

  // For current period only
  async CalculateYearGroupAverages() {
 
    console.log("Calculating Year Group Averages...");
    let currentPeriod = await Admin.GetCurrent();    
    let periodId = currentPeriod[0]._id;
    let period = await Period.findOne({_id: periodId});

    let data = await Average.aggregate([
      {
        $match: {
          average: { $gte: 1 },
          studentGrade: { $gte: 7 },
          "_id.periodId": new mongoose.Types.ObjectId(periodId)
        }
      },
      {
        $group: {
          _id: "$studentGrade",
          average: { $avg: "$average" }
        }
      },
      {
        $sort: {
          _id: 1
        }
      }       
    ]).exec();

    if(data.length > 0) {
      
      let count = 3.0;
      let average = 0.0;

      period.averages.year7 = data[0].average;
      period.averages.year8 = data[1].average;
      period.averages.year9 = data[2].average;
      average = data[0].average + data[1].average + data[2].average;

      if(data[3]) {
        period.averages.year10 = data[3].average;
        average += data[3].average;
        count = 4.0;
      }          
      
      if(data[4]) {
        period.averages.year11 = data[4].average;
        average += data[4].average;
        count = 5.0;
      }

      average = (average/count);
      period.averages.all = average;
      await period.save();
    }

    console.log('Year Group Averages Calculated Successfully'); 

  },

  // For all periods
  async CalculateAllYearGroupAverages() {
 
    console.log("Calculating Year Group Averages...");
    let periods = await Period.find({}).sort({order: 1}).cursor();
    let results = [];  

    await periods
      .eachAsync(async period => {
        let data = await Average.aggregate([
          {
            $match: {
              average: { $gte: 1 },
              studentGrade: { $gte: 7 },
              "_id.periodId": new mongoose.Types.ObjectId(period._id)
            }
          },
          {
            $group: {
              _id: "$studentGrade",
              average: { $avg: "$average" }
            }
          },
          {
            $sort: {
              _id: 1
            }
          }       
        ]).exec();

        let periodString = 
          "W" + period.week +
          ",T" + period.term +
          "," + String(period.year).substring(2, 4);

        results.push({ period: periodString, data: data });

        if(data.length > 0) {
          
          let count = 3.0;
          let average = 0.0;

          period.averages.year7 = data[0].average;
          period.averages.year8 = data[1].average;
          period.averages.year9 = data[2].average;
          average = data[0].average + data[1].average + data[2].average;

          if(data[3]) {
            period.averages.year10 = data[3].average;
            average += data[3].average;
            count = 4.0;
          }          
          
          if(data[4]) {
            period.averages.year11 = data[4].average;
            average += data[4].average;
            count = 5.0;
          }

          average = (average/count);
          period.averages.all = average;
          await period.save();

        }
      })
      .then(() => {
        console.log('Year Group Averages Calculated Successfully'); 
        //ctx.body = results;
      });
  },

  // Gets all student averages for each period
  async GetPeriodAverages(ctx) {       
    let data = await Average.aggregate([
      {
        $group: {
          _id: "$_id.periodId",
          average: { $avg: "$average" },
          students: { 
            $push: { 
              studentId: "$_id.studentId",
              average: "$average"
            }
          }
        }
      },
      {
        $lookup: {
          from: "periods",
          localField: "_id",
          foreignField: "_id",
          as: "period"
        }
      },
      {
        $project: {
          longTermAverage: "$average",
          studenGrade: "$studentGrade",
          year: { $arrayElemAt: ["$period.year", 0] },
          term: { $arrayElemAt: ["$period.term", 0] },
          week: { $arrayElemAt: ["$period.week", 0] },
          students: "$students"
        }
      }
    ]).exec();
    ctx.body = data;
  }

};