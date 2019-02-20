const Admin = require("./../models/admin");
const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");
const async = require("async");

module.exports = {
  async Test(ctx) {
    ctx.body = "Insights Test Function";
  }
};
