const Admin = require("./../models/admin");
const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");
const Utilities = require("./admin-utilities");
const csv = require("csvtojson");
const async = require("async");
const fs = require("fs");

module.exports = {
  // Run once on initial setup to generate admin table
  async AdminSetup(ctx) {
    let admin = new Admin({ isRapActive: false });
    await admin.save(function (err) {
      if(err) { 
        throw new Error(err);
      }
      console.log("Setup Success");
      ctx.body = "Setup Success";
    });    
  },

  // Imports timetable data from Edval in CSV format
  async ImportFromEdval(ctx) {
    let csvFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = await csv().fromFile(csvFilePath);
    if(jsonArrayObj.length == 0) {
      console.log("Invalid CSV File");
      ctx.throw(500,'Invalid CSV File');
    } else {
      Utilities.ProcessStudents(jsonArrayObj, ctx);
    }
    Utilities.DeleteFile(csvFilePath);
  },

  // Imports old RAP Data
  async ImportFromOldRap(ctx) {
    let jsonFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    Utilities.ProcessOldStudents(jsonArrayObj, ctx);
    Utilities.DeleteFile(jsonFilePath);
  }
};
