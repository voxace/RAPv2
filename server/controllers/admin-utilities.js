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

    // Joins names
    let name = firstname + " " + surname;

    // Import ID Numbers, set invalid numbers to 0
    let idNum = student["Student code"];
    if (parseInt(idNum) != idNum) {
      callback();
    } else {
      idNum = parseInt(idNum);
    }

    // Other fields
    let grade = student["Year"];
    let subject = student["Subject"];
    let code = student["Course code"];
    if (student["Class id"] != undefined) {
      code += student["Class id"];
    }

    // Process username if it exists
    let username = "";
    if (student["Email"] != undefined) {
      username = student["Email"].split("@")[0];
    }

    // Create Students
    let studentDbId;
    Student.NewStudent(name, username, idNum)
      .then(stu => {
        studentDbId = stu._id;
        console.log(stu.name + " : " + studentDbId);

        // Create Teachers
        let teacherDbId;
        Teacher.NewTeacher(teacher)
          .then(tch => {
            teacherDbId = tch._id;
            console.log(tch.name + " : " + teacherDbId);

            // Create Scores
            Score.NewScore(
              studentDbId,
              teacherDbId,
              periodDbId,
              subject,
              code,
              grade,
              0
            )
              .then(score => {
                console.log(
                  "Score created: " + stu.name + ", " + tch.name + ", " + code
                );
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
async function ProcessStudents(jsonArrayObj, ctx) {
  await Period.findOne({ active: true }, async function(error, activePeriod) {
    console.log("Processing Students...");
    let periodDbId = activePeriod._id;
    await async.eachSeries(
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

// Processes a single student from the old RAP Data (JSON)
async function ProcessSingleStudent(student, callback) {
  let name = student.name;
  let idNum = student.id;
  let username = student.username;

  // Create Students
  let studentDbId;
  Student.NewStudent(name, username, idNum)
    .then(stu => {
      studentDbId = stu._id;
      console.log(stu.name + " : " + studentDbId);

      async.eachSeries(
        student.rap,
        function(rapPeriod, cb) {
          ProcessSingleRapPeriod(rapPeriod, studentDbId, cb);
        },
        function(err) {
          if (err) {
            console.log("Error");
          }
        }
      );
    })
    .catch(err => {
      if (err) {
        console.log(err);
      }
    });

  callback();
}

// Processes a single RAP Period from the old RAP Data (JSON)
async function ProcessSingleRapPeriod(rapPeriod, studentDbId, callback) {
  let year = rapPeriod.year;
  let term = rapPeriod.term;
  let week = rapPeriod.week;
  let grade = rapPeriod.grade;

  await Period.NewPeriod(year, term, week, async function(error, period) {
    let periodDbId = period._id;
    console.log(
      "Processing " +
        year +
        ", Term " +
        term +
        ", Week " +
        week +
        " for StudentID: " +
        studentDbId
    );
    await async.eachSeries(
      rapPeriod.scores,
      function(score, cb) {
        ProcessSingleScore(score, studentDbId, periodDbId, grade, cb);
      },
      function(err) {
        if (err) {
          console.log("Error");
        }
      }
    );
  });

  callback();
}

// Processes a single score from the old RAP Data (JSON)
async function ProcessSingleScore(
  score,
  studentDbId,
  periodDbId,
  grade,
  callback
) {
  await Teacher.NewTeacher(score.teacher, async function(error, teacher) {
    let teacherDbId = teacher._id;
    let subject = score.subject;
    let code = score.code;
    let value = score.value;

    await Score.NewScore(
      studentDbId,
      teacherDbId,
      periodDbId,
      subject,
      code,
      grade,
      value,
      async function(error, newScore) {
        console.log(newScore);
        callback();
      }
    );
  });
}

// Processes old RAP Data (JSON)
async function ProcessOldStudents(jsonArrayObj, ctx) {
  console.log("Processing Students...");
  await async.eachSeries(
    jsonArrayObj,
    function(student, callback) {
      ProcessSingleStudent(student, callback);
    },
    function(err) {
      if (err) {
        ctx.body = "Error";
      } else {
        ctx.body = "Success";
      }
    }
  );
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
  ProcessOldStudents,
  DeleteFile
};
