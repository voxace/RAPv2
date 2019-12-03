const Admin = require("./../models/admin");
const Student = require("./../models/student");
const Teacher = require("./../models/teacher");
const Period = require("./../models/period");
const async = require("async");
const FormData = require("form-data");

// Checks login credentials using Sentral login form
function SubmitStudentForm (username, password) {
  return new Promise(function (resolve, reject) {
    var form = new FormData();
    form.append("username", username);
    form.append("password", password);
    form.submit(
      "https://mullumbimbyhs.sentral.com.au/portal/login/login",
      function (err, response) {
        if (response && response.headers.location == "http://mullumbimbyhs.sentral.com.au/portal/dashboard") {
          resolve(response);
        } else {
          reject(new Error("Invalid username or password"));
        }
      }
    );
  });
}

function SubmitTeacherForm (username, password) {
  return new Promise(function (resolve, reject) {
    var form = new FormData();
    form.append("sentral-username", username);
    form.append("sentral-password", password);
    form.submit(
      "https://mullumbimbyhs.sentral.com.au/check_login",
      function (err, response) {
        if (response && response.headers.location == "http://mullumbimbyhs.sentral.com.au/dashboard/?loggedin"
          || response.headers.location == "https://mullumbimbyhs.sentral.com.au/dashboard/?loggedin") {
          resolve(true);
        } else {
          reject("Invalid username and password");
        }
      }
    );
  });
}

async function RegisterTeacherLogin (ctx, teacher, password) {
  ctx.body = {
    user_id: teacher._id,
    name: teacher.name,
    type: "teacher",
    access: teacher.access || 1 // Returns default access of 1 if not set
  };
  console.log("Teacher login: " + teacher.name + ", " + new Date());

  // Register teacher login for this period
  let currentPeriod = await Admin.GetCurrent();
  await Period.TeacherLogin(currentPeriod[0]._id, teacher._id);
  teacher.password = password;
  teacher.lastLogin = Date.now();
  teacher.save();
}

async function RegisterStudentLogin (ctx, student, password) {
  ctx.body = {
    user_id: student._id,
    name: student.name,
    type: "student",
    access: 0
  };
  console.log("Student login: " + student.name + ", " + new Date());

  // Register student login for this period
  let currentPeriod = await Admin.GetCurrent();
  await Period.StudentLogin(currentPeriod[0]._id, student._id);
  student.password = password;
  student.lastLogin = Date.now();
  student.save();
}

module.exports = {
  // Attempts login and returns auth token
  // Auth token: { user_id, name, type, access  }
  async Login (ctx) {
    let username = ctx.request.body.username.toLowerCase();
    let password = ctx.request.body.password;

    // Teacher login
    let teacher = await Teacher.findOne({ username: username });
    if (teacher) {
      let loggedIn = await SubmitTeacherForm(username, password)
      if (loggedIn || teacher.password == password) {
        await RegisterTeacherLogin(ctx, teacher, password);
      } else {
        throw new Error("Invalid username and password");
      }
    } else {
      // Student login
      let student = await Student.findOne({ username: username });
      if (student) {
        let loggedIn = await SubmitStudentForm(username, password)
        if (loggedIn || student.password == password) {
          await RegisterStudentLogin(ctx, student, password);
        } else {
          throw new Error("Invalid username and password");
        }
      } else {
        throw new Error("User not found!")
      }
    }
  }

};
