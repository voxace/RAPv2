const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const csv = require("csvtojson");
const async = require("async");
const fs = require("fs");

// Fixes capitalization after hyphens or apostrophes
function CapitalizeFix(string) {
  string = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  return string.replace(/(^|[\s-'])\S/g, function(match) {
    return match.toUpperCase();
  });
}

// Fixes apostrophes in names by escaping them
function EscapeApostrophes(string) {
  return string.replace(/'/g, "'");
}

// Switches names from (Last First) to (First Last)
function ReorderName(string) {
  string = string.replace(/;/g, " ").replace(/  /g, " "); // Removes semicolon
  return string.split(" ")[1] + " " + string.split(" ")[0]; // Re-orders the names
}

// Processes a single row from the CSV file from Edval
async function ProcessSingleRow(student, callback, periodDbId) {
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

    let grade = student["Year"];
    let subject = student["Subject"];
    let code = student["Course code"];

    // Create Students
    let studentDbId;
    Student.NewStudent(firstname, surname)
      .then(stu => {
        studentDbId = stu._id;
        //console.log(stu.fullName + " : " + studentDbId);

        // Create Teachers
        let teacherDbId;
        Teacher.NewTeacher(teacher)
          .then(tch => {
            teacherDbId = tch._id;
            //console.log(tch.name + " : " + teacherDbId);

            // Create Scores
            Score.NewScore(
              studentDbId,
              teacherDbId,
              periodDbId,
              subject,
              code,
              grade
            )
              .then(score => {
                // console.log("Score created: " + stu.fullName + ", " + tch.name + ", " + code);
              })
              .catch(err => {
                if (err) {
                  console.log(err);
                }
              });
          })
          .catch(err => {
            if (err) {
              console.log(err);
            }
          });
      })
      .catch(err => {
        if (err) {
          console.log(err);
        }
      });

    callback();
  }
}

// Processes the CSV file from Edval
async function ProcessStudents(jsonArrayObj, activePeriod, ctx) {
  await Period.findOne({ active: true }, function(error, activePeriod) {
    console.log("Processing Students...");
    let periodDbId = activePeriod._id;
    async.eachSeries(
      jsonArrayObj,
      function(student, callback) {
        ProcessSingleRow(student, callback, periodDbId);
      },
      function(err) {
        if (err) {
          ctx.body = "Error";
        } else {
          ctx.body = "Success";
        }
      }
    );
  });
}

// Deletes the specified file
function DeleteFile(file) {
  fs.unlink(file, err => {
    if (err) {
      console.log("An error occured");
      throw new Error(err);
    } else {
      console.log("Temporary file was deleted");
    }
  });
}

module.exports = {
  CapitalizeFix,
  EscapeApostrophes,
  ReorderName,
  ProcessStudents,
  DeleteFile
};
