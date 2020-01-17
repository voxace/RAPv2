const Admin = require("./../models/admin");
const Average = require("./../models/average");
const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");
const mongoose = require("mongoose");
const csv = require("csvtojson");
const async = require("async");
const fs = require("fs");

module.exports = {
  /* -------------------- UTILITIES -------------------- */

  // Fixes capitalization after hyphens or apostrophes
  CapitalizeFix (string) {
    string = string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    return string.replace(/(^|[\s-'])\S/g, function (match) {
      return match.toUpperCase();
    });
  },

  // Deletes the specified file
  DeleteFile (file) {
    fs.unlink(file, err => {
      if (err) {
        console.log("An error occured");
        throw new Error(err);
      } else {
        console.log("Temporary file was deleted");
      }
    });
  },

  // Fixes apostrophes in names by escaping them
  EscapeApostrophes (string) {
    return string.replace(/'/g, "'");
  },

  // Switches names from (Last First) to (First Last)
  ReorderName (string) {
    string = string.replace(/;/g, " ").replace(/  /g, " "); // Removes semicolon
    return string.split(" ")[1] + " " + string.split(" ")[0]; // Re-orders the names
  },

  /* -------------------- EMU IMPORT -------------------- */

  // Processes the CSV file from EMU
  async ProcessEMU (jsonArrayObj, ctx) {
    await async.eachSeries(
      jsonArrayObj,
      function (student, callback) {
        if (student['studentNo'] == null || student['DEC User ID'] == null) {
          console.log("Error in EMU file");
          callback();
        } else {
          Student.findOneAndUpdate({ student_id: student['studentNo'] }, { username: student['DEC User ID'] }, { new: true })
            .then(stu => {
              console.log(stu);
            })
            .catch(err => {
              console.log(err);
            })
          callback();
        }
      },
      function (err) {
        if (err) {
          throw new Error(err);
        } else {
          ctx.body = "Success";
        }
      });
  },

  /* -------------------- LMBR IMPORT -------------------- */

  // Processes the CSV file from LMBR to update student genders
  async ProcessLMBR (jsonArrayObj, ctx) {
    await async.eachSeries(
      jsonArrayObj,
      function (student, callback) {
        if (student['StatewideId'] == null || student['M/F'] == null) {
          console.log("Error in LMBR file");
          callback();
        } else {
          Student.findOneAndUpdate({ student_id: student['StatewideId'] }, { gender: student['M/F'] }, { new: true })
            .then(stu => {
              console.log(stu);
            })
            .catch(err => {
              console.log(err);
            })
          callback();
        }
      },
      function (err) {
        if (err) {
          throw new Error(err);
        } else {
          ctx.body = "Success";
        }
      });
  },

  /* -------------------- OLD SPREADSHEET -------------------- */

  // Processes the CSV file from the old spreadsheet to get student averages
  async ProcessOldSpreadsheet (jsonArrayObj, period, ctx) {
    await async.eachSeries(
      jsonArrayObj,
      function (student, callback) {
        if (student['Name'] == null || student['Year'] == null || student['Score'] == null) {
          console.log("Error in Spreadsheet");
          callback();
        } else {
          let name = student['Name'];
          let periodId = new mongoose.Types.ObjectId(period);
          let average = student['Score'];
          let studentGrade = student['Year'];
          Student.findOne({ name: name })
            .then(stu => {
              if (stu && average > 0) {
                let studentId = stu._id;
                Average.NewAverage({ "studentId": studentId, "periodId": periodId }, average, studentGrade)
                  .then(result => {
                    console.log(name + ': ' + average + ' - Year ' + studentGrade);
                    callback();
                  });
              } else {
                callback();
              }
            });
        }
      },
      function (err) {
        if (err) {
          throw new Error(err);
        } else {
          console.log("Success");
        }
      });
  },

  /* -------------------- EDVAL IMPORT -------------------- */

  // Processes the CSV file from Edval
  async ProcessEdval (jsonArrayObj, ctx) {
    await Admin.GetCurrent()
      .then(async (activePeriod) => {
        console.log("Processing Students...");
        let periodDbId = activePeriod[0]._id;
        await async.eachSeries(jsonArrayObj,
          function (student, callback) {
            module.exports.ProcessSingleRowEdval(student, callback, periodDbId);
          },
          function (err) {
            if (err) {
              console.log('A file failed to process');
              throw new Error(err);
            } else {
              console.log('All files have been processed successfully');
              ctx.body = "Success";
            }
          }
        );
      });
  },

  // Processes a single row from the CSV file from Edval
  async ProcessSingleRowEdval (student, callback, periodDbId) {
    // Ignore entire row if it is a redundant subject
    if (
      student["Subject"] == "Assembly" ||
      student["Subject"] == "Care" ||
      student["Subject"] == "Sport" ||
      student["Subject"] == "Distance ED" ||
      student["Teacher"] == "undefined " ||
      student["Year"] == "12" ||
      student["Student code"] == "undefined" ||
      student["Teacher name"] == null ||
      student["Surname"] == null ||
      student["First name"] == null
    ) {
      callback();
    } else {
      // Fixes Teacher Name
      let teacher = student["Teacher name"];
      teacher = module.exports.ReorderName(teacher);
      teacher = module.exports.CapitalizeFix(teacher);

      // Fixes Student Surname
      let surname = student["Surname"];
      surname = module.exports.CapitalizeFix(surname);
      surname = module.exports.EscapeApostrophes(surname);

      // Fixes Student First Name
      let firstname = student["First name"];
      firstname = module.exports.CapitalizeFix(firstname);
      firstname = module.exports.EscapeApostrophes(firstname);

      // Joins names
      let name = firstname + " " + surname;

      // Import ID Numbers, set invalid numbers to 0
      let idNum = student["Student code"];
      if (parseInt(idNum) != idNum) {
        console.log(name + " has an invalid ID number: " + idNum);
        callback();
        return;
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
      //console.log("Student: " + name + ", ID: " + idNum + ", Period: " + periodDbId);
      Student.NewStudent(name, username, idNum)
        .then(stu => {
          studentDbId = stu._id;
          //console.log(stu.name + " : " + studentDbId);

          // Create Teachers
          let teacherDbId;
          Teacher.NewTeacher(teacher)
            .then(tch => {
              teacherDbId = tch._id;
              //console.log(tch.name + " : " + teacherDbId);

              // Create Subjects
              let subjectDbId;
              Subject.NewSubject(subject, code)
                .then(sub => {
                  subjectDbId = sub._id;
                  //console.log(sub.name + " : " + subjectDbId);

                  // Create Scores
                  Score.NewScore(
                    studentDbId,
                    teacherDbId,
                    periodDbId,
                    subjectDbId,
                    grade,
                    0
                  )
                    .then(score => {
                      console.log(
                        "Score created: " +
                        stu.name +
                        ", " +
                        tch.name +
                        ", " +
                        code
                      );
                    })
                    // Catch errors with Score insert
                    .catch(err => {
                      if (err) {
                        console.log(err);
                      }
                    });
                })
                // Catch errors with Subject insert
                .catch(err => {
                  if (err) {
                    console.log(err);
                  }
                });
            })
            // Catch errors with Teacher insert
            .catch(err => {
              if (err) {
                console.log(err);
              }
            });
        })
        // Catch errors with Student insert
        .catch(err => {
          if (err) {
            console.log(err);
          }
        });

      callback();
    }
  },

  /* -------------------- SENTRAL RAP IMPORT -------------------- */

  // Processes the CSV file from Edval
  async ProcessSentral (jsonArrayObj, ctx) {
    await Admin.GetCurrent()
      .then(async (activePeriod) => {
        console.log("Processing Students...");
        let periodDbId = activePeriod[0]._id;
        await async.eachSeries(jsonArrayObj,
          function (student, callback) {
            module.exports.ProcessSingleRowSentral(student, callback, periodDbId);
          },
          function (err) {
            if (err) {
              console.log('A file failed to process');
              throw new Error(err);
            } else {
              console.log('All files have been processed successfully');
              ctx.body = "Success";
            }
          }
        );
      });
  },

  // Processes a single row from the CSV file from Sentral
  async ProcessSingleRowSentral (student, callback, periodDbId) {
    // Ignore entire row if it is a redundant subject
    if (
      student["Outcome_1"] == "0" ||
      student["Outcome_1"] == null ||
      student["Student ID"] == null ||
      student["Year"] == null ||
      student["Class"] == null ||
      student["Surname"] == null ||
      student["Firstname"] == null ||
      student["Gender"] == null ||
      student["Subject"] == null ||
      student["Teacher"] == null
    ) {
      console.log('Error with Row: ' + JSON.stringify(student));
      callback();
    } else {

      // Fixes Teacher Name
      let teacher = student["Teacher"];
      teacher = teacher.trim();
      teacher = module.exports.CapitalizeFix(teacher);

      // Remove titles from teacher name if they exist
      let regex = /(Mr|Mrs|Miss|Ms|Dr|MR|MRS|MISS|MS)(\.?)\s/;
      let match = regex.exec(teacher);
      if (match !== null) teacher = teacher.replace(match[0], "");

      // Fixes Student Surname
      let surname = student["Surname"];
      surname = module.exports.CapitalizeFix(surname);
      surname = module.exports.EscapeApostrophes(surname);

      // Fixes Student First Name
      let firstname = student["Firstname"];
      firstname = module.exports.CapitalizeFix(firstname);
      firstname = module.exports.EscapeApostrophes(firstname);

      // Joins names
      let name = firstname + " " + surname;

      // Import ID Numbers, set invalid numbers to 0
      let idNum = student["Student ID"];
      if (parseInt(idNum) != idNum) {
        console.log(name + " has an invalid ID number: " + idNum);
        callback();
        return;
      } else {
        idNum = parseInt(idNum);
      }

      // Other fields
      let grade = student["Year"];
      let code = student["Class"];
      let subject = student["Subject"];
      let gender = student["Gender"];
      let rapScore = student["Outcome_1"];

      // Query existing data
      let newStudent = await Student.NewStudentSentral(name, grade, gender, idNum);
      let newTeacher = await Teacher.NewTeacher(teacher);
      let newSubject = await Subject.NewSubject(subject, code);

      // Debugging
      // console.log('Teacher: ' + teacher);
      // console.log('Student: ' + name);
      // console.log('ID: ' + idNum);
      // console.log('Grade: ' + grade);
      // console.log('Code: ' + code);
      // console.log('Score: ' + rapScore);

      // if (newStudent && newTeacher && newSubject) {
      //   console.log('StudentDBid: ' + newStudent._id);
      //   console.log('SubjectDBid: ' + newSubject._id);
      //   console.log('TeacherDBid: ' + newTeacher._id);
      // } else {
      //   console.log('Error in one of the fields: ');
      //   console.log('StudentDB: ' + newStudent);
      //   console.log('SubjectDB: ' + newSubject);
      //   console.log('TeacherDB: ' + newTeacher);
      // }
      // console.log('-----------------------------------');

      // Create scores
      Score.NewScore(
        newStudent._id,
        newTeacher._id,
        periodDbId,
        newSubject._id,
        grade,
        rapScore
      )
        .then(score => {
          console.log("Score created: " + newStudent.name + ", "
            + newTeacher.name + ", " + code + ", " + rapScore);
        })
        .catch(err => {
          if (err) {
            console.log(err);
          }
        });

      callback();
    }
  },

  /* -------------------- LEGACY RAP IMPORT -------------------- */

  // Processes a single student from the old RAP Data (JSON)
  async ProcessSingleStudentLegacy (student, callback) {
    let name = student.name;
    let idNum = student.id;
    let username = student.username;

    // Create Students
    let studentDbId;
    Student.NewStudent(name, username, idNum).then(stu => {
      studentDbId = stu._id;
      console.log("Processed " + stu.name + " : " + studentDbId);

      async.eachSeries(
        student.rap,
        function (rapPeriod, cb) {
          module.exports.ProcessSingleRapPeriodLegacy(rapPeriod, studentDbId, cb);
        },
        function (err) {
          if (err) {
            console.log("Error processing single student");
          }
        }
      );
    });

    callback();
  },

  // Processes a single RAP Period from the old RAP Data (JSON)
  async ProcessSingleRapPeriodLegacy (rapPeriod, studentDbId, callback) {
    let year = rapPeriod.year;
    let term = rapPeriod.term;
    let week = rapPeriod.week;
    let grade = rapPeriod.grade;

    await Period.NewPeriod(year, term, week, async function (error, period) {
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
        function (score, cb) {
          module.exports.ProcessSingleScoreLegacy(score, studentDbId, periodDbId, grade, cb);
        },
        function (err) {
          if (err) {
            console.log("Error processing RAP Period");
          }
        }
      );
    });

    callback();
  },

  // Processes a single score from the old RAP Data (JSON)
  async ProcessSingleScoreLegacy (score, studentDbId, periodDbId, grade, callback) {
    await Teacher.NewTeacher(score.teacher, async function (error, teacher) {
      let teacherDbId = teacher._id;
      let subject = score.subject;
      let code = score.code;
      let value = score.value;

      await Subject.NewSubject(subject, code, async function (error, newSubject) {
        let subjectDbId = newSubject._id;

        await Score.NewScore(
          studentDbId,
          teacherDbId,
          periodDbId,
          subjectDbId,
          grade,
          value,
          async function (error, newScore) {
            if (error) console.log(error);
            else console.log("Score: " + newScore._id);
            callback();
          }
        );
      });
    });
  },

  // Processes old RAP Data (JSON)
  async ProcessOldStudentsLegacy (jsonArrayObj, ctx) {
    console.log("Processing Students...");
    await async.eachSeries(
      jsonArrayObj,
      function (student, callback) {
        module.exports.ProcessSingleStudentLegacy(student, callback);
      },
      function (err) {
        if (err) {
          ctx.body = "Error";
        } else {
          ctx.body = "Success";
        }
      }
    );
  }

};
