const Teacher = require("./../models/teacher");
const async = require("async");

module.exports = {
  async Test(ctx) {
    ctx.body = "Teacher Test Function";
  }
};
