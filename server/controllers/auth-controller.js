const Student = require("./../models/student");
const Teacher = require("./../models/teacher");
const async = require("async");
const FormData = require("form-data");

// Checks login credentials using Sentral login form
function SubmitLoginForm(username, password) {
  return new Promise(function(resolve, reject) {
    var form = new FormData();
    form.append("username", username);
    form.append("password", password);
    form.submit(
      "https://web2.mullumbimb-h.schools.nsw.edu.au/portal/login/login",
      function(err, response) {
        if (err !== null) reject(err);
        else if (response.headers.location == "/portal/dashboard") {
          resolve(response);
        } else {
          reject(new Error("Invalid username or password"));
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
          } else {
            await Student.findOne({ username: username }).then(student => {
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
