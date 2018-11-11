const Student = require("./../models/student");
const Period = require("./../models/period");
const _ = require("lodash");
const csv = require("csvtojson");
const async = require("async");
const fs = require("fs");

function CapitalizeFix(string) {
  string = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  return string.replace(/(^|[\s-'])\S/g, function(match) {
    return match.toUpperCase();
  });
}

function EscapeApostrophes(string) {
  return string.replace(/'/g, "'");
}

function ReorderName(string) {
  string = string.replace(/;/g, " ").replace(/  /g, " "); // Removes semicolon
  return string.split(" ")[1] + " " + string.split(" ")[0]; // Re-orders the names
}

function getCurrentRapPeriod() {
  Student.findOne({ student_id: idNum })
    .then(period => {
      return period;
    })
    .catch(err => {
      throw new Error(err);
    });
}

module.exports = {
  // Imports timetable data from Edval in CSV format
  async importFromEdval(ctx) {
    let csvFilePath = ctx.request.files["Upload"].path;
    let output = [];

    await csv()
      .fromFile(csvFilePath)
      .then(function(jsonArrayObj) {
        // get current rap period here
        let currentRapPeriod = "123456789";

        async.eachSeries(jsonArrayObj, function(student, callback) {
          // Ignore entire row if it is a redundant subject
          if (
            student["Subject"] == "Assembly" ||
            student["Subject"] == "Care" ||
            student["Subject"] == "Sport" ||
            student["Subject"] == "Distance ED" ||
            student["Teacher"] == "undefined " ||
            student["Year"] == "11" ||
            student["Year"] == "12" ||
            student["Student code"] == "undefined"
          ) {
            callback();
          } else {
            // Fixes Teacher Name
            let teacher = student["Teacher name"];
            teacher = ReorderName(teacher);
            teacher = CapitalizeFix(teacher);

            // Fixes Student Surname
            let surname = student["Surname"];
            surname = CapitalizeFix(surname);
            surname = EscapeApostrophes(surname);

            // Fixes Student First Name
            let firstname = student["First name"];
            firstname = CapitalizeFix(firstname);
            firstname = EscapeApostrophes(firstname);

            // Import ID Numbers, set invalid numbers to 0
            let idNum = student["Student code"];
            if (parseInt(idNum) != idNum) {
              callback();
            }

            let studentDatabaseId;

            Student.findOne({ student_id: idNum })
              .then(user => {
                if (user) {
                  studentDatabaseId = user._id;
                  console.log(
                    firstname + " " + surname + " already in database"
                  );
                } else {
                  new Student({
                    name: { first: firstname, last: surname },
                    student_id: idNum
                  })
                    .save()
                    .then(newStudent => {
                      console.log("New student created: " + newStudent);
                      console.log(firstname + " " + surname + " added");
                      studentDatabaseId = newStudent._id;
                    })
                    .catch(err => {
                      throw new Error(err);
                    });
                }
              })
              .catch(err => {
                if (err) {
                  throw new Error(err);
                  callback();
                }
              });

            let result =
              firstname + " " + surname + ", " + teacher + ", " + idNum + ", ";

            output.push(result);
            callback();
          }
        });
      })
      .then(() => {
        ctx.body = JSON.stringify(output);
      })
      .then(() => {
        fs.unlink(csvFilePath, err => {
          if (err) {
            console.log("An error occured");
            throw err;
          } else {
            console.log("Temporary file was deleted");
          }
        });
      });
  }
};
