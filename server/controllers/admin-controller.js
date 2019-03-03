const Admin = require("./../models/admin");
const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");
const Utilities = require("./admin-utilities");
const PDF = require("./admin-pdf");
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
      await Utilities.ProcessEdval(jsonArrayObj, ctx);
    }
    await Utilities.DeleteFile(csvFilePath);
  },

  // Imports student data from EMU in CSV format
  async ImportFromEMU(ctx) {
    let csvFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = await csv().fromFile(csvFilePath);
    if(jsonArrayObj.length == 0) {
      console.log("Invalid CSV File");
      ctx.throw(500,'Invalid CSV File');
    } else {
      await Utilities.ProcessEMU(jsonArrayObj, ctx);
    }
    await Utilities.DeleteFile(csvFilePath);
  },

  // Imports student data from LMBR in CSV format
  async ImportFromLMBR(ctx) {
    let csvFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = await csv().fromFile(csvFilePath);
    if(jsonArrayObj.length == 0) {
      console.log("Invalid CSV File");
      ctx.throw(500,'Invalid CSV File');
    } else {
      await Utilities.ProcessLMBR(jsonArrayObj, ctx);
    }
    await Utilities.DeleteFile(csvFilePath);
  },

  // Imports old RAP Data
  async ImportFromOldRap(ctx) {
    let jsonFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    await Utilities.ProcessOldStudentsLegacy(jsonArrayObj, ctx);
    await Utilities.DeleteFile(jsonFilePath);
  },

  // Generate RAP Posters
  async GeneratePosters(ctx) {
    let periodId = ctx.params.period;
    await Admin.GetCurrent()
    .then(currentPeriod => {
      periodId = currentPeriod[0]._id;
    });    
    await Score.GetPosterData(periodId)
      .then(async scores => {
        await PDF.GeneratePosters(scores, ctx);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Get Rap Lock Status
  async GetActiveStatus(ctx) {
    await Admin.GetActiveStatus()
      .then(status => {
        console.log(status[0]);
        ctx.body = JSON.stringify(status[0]);
      })
      .catch(err => {
        console.log(err);
        throw new Error(err);
      });
  },

  // Sets Rap Lock Status
  async SetActiveStatus(ctx) {
    if(ctx.request.body.status) {}
    await Admin.SetActiveStatus(ctx.request.body.status)
      .then(status => {
        ctx.body = JSON.stringify(status);
      })
      .catch(err => {
        throw new Error(err);
      });
  },

};
