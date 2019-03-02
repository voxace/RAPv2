const Admin = require("./../models/admin");
const Student = require("./../models/student");
const Period = require("./../models/period");
const Score = require("./../models/score");
const Teacher = require("./../models/teacher");
const Subject = require("./../models/subject");
const PDFDocument = require("pdfkit");
const async = require("async");
const fs = require("fs");

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function calcLineGap(count) {
  //console.log(count);
  if (count > 126) {
    return 0;
  } else if (count > 118) {
    return 2;
  } else if (count > 110) {
    return 3;
  } else if (count > 96) {
    return 4;
  } else if (count > 92) {
    return 7;
  } else if (count > 89) {
    return 8;
  } else if (count > 85) {
    return 10;
  } else if (count > 80) {
    return 11;
  } else if (count > 75) {
    return 12;
  } else if (count > 70) {
    return 13;
  } else if (count > 60) {
    return 18;
  } else {
    return 24;
  }
}

module.exports = {

  // Processes the CSV file from EMU
  async GeneratePosters(scores, ctx) {
    
    //ctx.body = JSON.stringify(scores);
    let year = scores[0].period[0].year;
    let term = scores[0].period[0].term;
    let week = scores[0].period[0].week;

    var doc = new PDFDocument({
      layout: "portrait",
      size: [842, 1191],
      margins: {
        top: 150,
        bottom: 50,
        left: 20,
        right: 20
      }
    });

    doc.pipe(fs.createWriteStream('./public/file.pdf'));

    await Object.values(scores).forEach(async function(yearGroup) {

      let text = '';
      let count = yearGroup.scores.length;
      console.log("Year " + yearGroup._id + ": " + count);
      await Object.values(yearGroup.scores).forEach(function(student) {
        text += student.name + '  (' + Number(student.average).toFixed(2) + ')\n';
      })      

      if(yearGroup._id != 7) { doc.addPage(); }
      
      doc.image("./public/rap-poster.jpg", 0, 0);

      doc
        .fontSize(34)
        .font("Helvetica-Bold")
        .text(
          "Year " + yearGroup._id + " - Term " + term + " Week " + week + " " + year,
          {
            height: 100,
            width: 842,
            align: "center",
            lineGap: 20
          }
        );

      doc
        .fontSize(16)
        .font("Helvetica")
        .text(text, {
          columns: 3,
          columnGap: 5,
          height: 820,
          width: 802,
          align: "center",
          lineGap: calcLineGap(count)
        });

    })

    await doc.end();

    const src = await fs.createReadStream('./public/file.pdf');
    await ctx.response.set("content-type", "application/pdf");
    await timeout(100);
    ctx.body = src;
    await timeout(2000);
    fs.unlink('./public/file.pdf', err => {
      if (err) {
        console.log("An error occured deleting the file.");
        throw new Error(err);
      } else {
        console.log("Temporary file was deleted.");
      }
    });

  }

};
