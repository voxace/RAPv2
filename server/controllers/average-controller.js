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
  // Results are stored in the 'averages' table
  async CalculatePeriodAverages(ctx) {       
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
          average: { $avg: "$score" }
        }
      },
      {
        $out: "averages"
      } 
    ]).exec();
    ctx.body = "Averages Processed";
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
          year: { $arrayElemAt: ["$period.year", 0] },
          term: { $arrayElemAt: ["$period.term", 0] },
          week: { $arrayElemAt: ["$period.week", 0] },
          students: "$students"
        }
      }
    ]).exec();
    ctx.body = data;
  },

  // Find by name/period and save average
  async FindByNameAndSaveAverage(ctx) {
    
    let name = ctx.request.body.name;
    let periodId = new mongoose.Types.ObjectId(ctx.request.body.period);
    let average = ctx.request.body.average;

    let student = await Student.findOne({ name: name });
    let studentId = student._id;

    await Average.NewAverage({ "studentId": studentId,  "periodId": periodId }, average)
      .then(result => {
        console.log(result);
        ctx.body = result;
      });
    
  }

};