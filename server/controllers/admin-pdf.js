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
  if (count <= 60) {    
    return 23;
  } else if (count <=63) {
    return 22;
  } else if (count <=66) {
    return 20;
  } else if (count <=69) {
    return 19;
  } else if (count <=72) {
    return 17;
  } else if (count <=75) {
    return 16;
  } else if (count <=78) {
    return 14;
  } else if (count <=81) {
    return 13;
  } else if (count <=84) {
    return 12;
  } else if (count <=87) {
    return 11;
  } else if (count <=90) {
    return 10;
  } else if (count <=93) {
    return 9;
  } else if (count <=96) {
    return 8;
  } else if (count <=99) {
    return 7;
  } else if (count <=102) {
    return 6.5;
  } else if (count <=105) {
    return 6;
  } else if (count <=108) {
    return 5;
  } else if (count <=111) {
    return 4.5;
  } else if (count <=114) {
    return 4;
  } else if (count <=117) {
    return 3.5;
  } else if (count <=120) {
    return 3;
  } else if (count <=123) {
    return 2.5;
  } else if (count <=126) {
    return 2;
  } else if (count <=129) {
    return 1.5;
  } else if (count <=132) {
    return 1;
  } else if (count <=135) {
    return 0.5;
  } else {
    return 0;
  }
}

module.exports = {

  // Processes the CSV file from EMU
  async GeneratePosters(scores, ctx) {
    
    let year = scores[0].period[0].year;
    let term = scores[0].period[0].term;
    let week = scores[0].period[0].week;

    var doc = new PDFDocument({
      layout: "portrait",
      size: [842, 1191],
      margins: {
        top: 150,
        bottom: 50,
        left: 10,
        right: 10
      }
    });

    doc.pipe(fs.createWriteStream('./public/file.pdf'));

    await Object.values(scores).forEach(async function(yearGroup) {

      let text = '';
      let count = yearGroup.scores.length;
      console.log("Year " + yearGroup._id + ": " + count);
      await Object.values(yearGroup.scores).forEach(function(student) {
        text += student.name + ' (' + Number(student.average).toFixed(2) + ')\n';
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
        .fontSize(15)
        .font("Helvetica")
        .text(text, {
          columns: 3,
          columnGap: 5,
          height: 820,
          width: 822,
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
