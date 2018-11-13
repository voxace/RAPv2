const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const async = require("async");

module.exports = {
  async Test(ctx) {
    ctx.body = "Insights Test Function";
  }
};
