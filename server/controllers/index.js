const admin = require("./admin-controller");
const average = require("./average-controller");
const auth = require("./auth-controller");
const insights = require("./insights-controller");
const period = require("./period-controller");
const score = require("./score-controller");
const student = require("./student-controller");
const subject = require("./subject-controller");
const teacher = require("./teacher-controller");

module.exports = {
  admin,
  average,
  auth,
  insights,
  period,
  score,
  student,
  subject,
  teacher
};
