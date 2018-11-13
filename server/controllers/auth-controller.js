const Student = require("./../models/student");
const Teacher = require("./../models/teacher");
const async = require("async");

module.exports = {
  async Login(ctx) {
    ctx.body = "Logged in!";
  }
};
