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
const os = require('os');
const path = require('path');

// Async timeout utility
function timeout (ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = {
  // Run once on initial setup to generate admin table
  async AdminSetup (ctx) {
    let admin = new Admin({ isRapActive: false });
    await admin.save(function (err) {
      if (err) {
        throw new Error(err);
      }
      console.log("Setup Success");
      ctx.body = "Setup Success";
    });
  },

  // Imports timetable data from Edval in CSV format
  async ImportFromEdval (ctx) {
    let csvFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = await csv().fromFile(csvFilePath);
    if (jsonArrayObj.length == 0) {
      console.log("Invalid CSV File");
      ctx.throw(500, 'Invalid CSV File');
    } else {
      await Utilities.ProcessEdval(jsonArrayObj, ctx);
    }
    await Utilities.DeleteFile(csvFilePath);
  },

  // Imports timetable data from Sentral in CSV format
  async ImportFromSentral (ctx) {
    let csvFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = await csv().fromFile(csvFilePath);
    if (jsonArrayObj.length == 0) {
      console.log("Invalid CSV File");
      ctx.throw(500, 'Invalid CSV File');
    } else {
      await Utilities.ProcessSentral(jsonArrayObj, ctx);
    }
    await Utilities.DeleteFile(csvFilePath);
  },

  // Imports student data from EMU in CSV format
  async ImportFromEMU (ctx) {
    let csvFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = await csv().fromFile(csvFilePath);
    if (jsonArrayObj.length == 0) {
      console.log("Invalid CSV File");
      ctx.throw(500, 'Invalid CSV File');
    } else {
      await Utilities.ProcessEMU(jsonArrayObj, ctx);
    }
    await Utilities.DeleteFile(csvFilePath);
  },

  // Imports student data from LMBR in CSV format
  async ImportFromLMBR (ctx) {
    let csvFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = await csv().fromFile(csvFilePath);
    if (jsonArrayObj.length == 0) {
      console.log("Invalid CSV File");
      ctx.throw(500, 'Invalid CSV File');
    } else {
      await Utilities.ProcessLMBR(jsonArrayObj, ctx);
    }
    await Utilities.DeleteFile(csvFilePath);
  },

  // Imports student data from old spreadsheet
  async ImportFromOldSpreadsheet (ctx) {
    let period = ctx.request.files["Upload"].name.substring(0, 24);
    let csvFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = await csv().fromFile(csvFilePath);
    if (jsonArrayObj.length == 0) {
      console.log("Invalid CSV File");
      ctx.throw(500, 'Invalid CSV File');
    } else {
      ctx.body = "Upload Success";
      await Utilities.ProcessOldSpreadsheet(jsonArrayObj, period, ctx);
    }
    await Utilities.DeleteFile(csvFilePath);
  },

  // Imports student photos
  async ImportStudentPhotos (ctx) {

    // Function to move files
    async function moveFile (file) {
      let oldPath = file.path;
      let newPath = './public/students/' + file.name;
      await fs.rename(oldPath, newPath, function (err) { if (err) { console.log('Error: ' + err) } });
    }

    // List of files uploaded
    const files = ctx.request.files;

    // Move files to students folder
    if (files.Upload.length > 1) {
      files.Upload.forEach(async (file) => {
        await moveFile(file);
      })
    } else {
      await moveFile(files.Upload);
    }

    ctx.body = "Success";

  },

  // Imports old RAP Data
  async ImportFromOldRap (ctx) {
    let jsonFilePath = ctx.request.files["Upload"].path;
    let jsonArrayObj = JSON.parse(fs.readFileSync(jsonFilePath, "utf8"));
    await Utilities.ProcessOldStudentsLegacy(jsonArrayObj, ctx);
    await Utilities.DeleteFile(jsonFilePath);
  },

  // Generate RAP Posters
  async GeneratePosters (ctx) {
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
  async GetActiveStatus (ctx) {
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
  async SetActiveStatus (ctx) {
    if (ctx.request.body.status) { }
    await Admin.SetActiveStatus(ctx.request.body.status)
      .then(status => {
        ctx.body = JSON.stringify(status);
      })
      .catch(err => {
        throw new Error(err);
      });
  },

  // Gets teachers by completion status
  async GetTeacherCompletion (ctx) {

    let complete = [];
    let incomplete = [];
    let period = await Admin.GetCurrent();
    let periodId = period[0]._id;
    let averages = await Score.GetTeacherPeriodAverage(periodId);

    await async.eachSeries(averages, function (teacher, callback) {
      if (teacher.average == 0) {
        incomplete.push({ teacherId: teacher._id, name: teacher.name });
        callback();
      } else {
        complete.push({ teacherId: teacher._id, name: teacher.name });
        callback();
      }
    }, function (err) {
      if (err) {
        throw new Error(err);
      } else {
        let percentage = Number(complete.length / averages.length * 100.0).toFixed(2);
        ctx.body = { complete: complete, incomplete: incomplete, percentage };
        console.log('Finished processing!');
      }
    });
  }

};
