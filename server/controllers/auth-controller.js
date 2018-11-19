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
  // Attempts login and returns user ID
  async Login(ctx) {
    let username = ctx.request.body.username.toLowerCase();
    let password = ctx.request.body.password;
    await SubmitLoginForm(username, password)
      .then(async response => {
        await Teacher.findOne({ username: username }).then(async teacher => {
          if (teacher) {
            ctx.body = teacher._id;
            console.log("Teacher login: " + teacher.name + ", " + new Date());
          } else {
            await Student.findOne({ username: username }).then(student => {
              if (student) {
                ctx.body = student._id;
                console.log(
                  "Student login: " + student.fullName + ", " + new Date()
                );
              } else {
                ctx.body = "invalid";
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
