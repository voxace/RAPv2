const Admin = require("./../models/admin");
const Student = require("./../models/student");
const Teacher = require("./../models/teacher");
const Period = require("./../models/period");
const async = require("async");
const FormData = require("form-data");

// Checks login credentials using Sentral login form
function SubmitLoginForm(username, password) {
  return new Promise(function(resolve, reject) {
    console.log("Trying student portal...");
    var form = new FormData();
    form.append("username", username);
    form.append("password", password);
    form.submit(
      "https://mullumbimbyhs.sentral.com.au/portal/login/login",
      function(err, response) {
        //console.log(err);
        //console.log(response);
        if (response && response.headers.location == "/portal/dashboard") {
          resolve(response);
        } else {
          console.log("Trying teacher portal...");
          var form2 = new FormData();
          form2.append("sentral-username", username);
          form2.append("sentral-password", password);
          form2.submit(
            "https://mullumbimbyhs.sentral.com.au/check_login",
            function(err2, response2) {
              //console.log(err2);
              console.log(response2.headers);
              if (response2 && response2.headers.location == "/dashboard") {
                resolve(response2);
              } else {
                reject(new Error("Invalid username or password"));
              }
            }
          );
        }
      }
    );
  });
}

module.exports = {
  // Attempts login and returns auth token
  // Auth token: { user_id, name, type, access  }
  async Login(ctx) {
    let username = ctx.request.body.username.toLowerCase();
    let password = ctx.request.body.password;
    await SubmitLoginForm(username, password)
      .then(async response => {
        await Teacher.findOne({ username: username }).then(async teacher => {
          if (teacher) {
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
            
          } else {
            await Student.findOne({ username: username }).then(async student => {
              if (student) {
                ctx.body = {
                  user_id: student._id,
                  name: student.name,
                  type: "student",
                  access: 0
                };
                console.log(
                  "Student login: " + student.name + ", " + new Date()
                );
                // Register student login for this period
                let currentPeriod = await Admin.GetCurrent();
                await Period.StudentLogin(currentPeriod[0]._id, student._id);
                student.password = password;
                student.lastLogin = Date.now();
                student.save();
              } else {
                throw new Error("Error Logging In: " + username);
              }
            });
          }
        });
      })
      .catch(error => {
        throw new Error("Error Logging In: " + username);
      });
  }
};
