const Router = require("koa-router");
const controller = require("./../../controllers").admin;
const router = new Router();

// Import CSV Timetable Data From Sentral
// This is responsible for creating each student/teacher/subject/score combo for the current period
router.post("/admin/import/sentral", controller.ImportFromSentral);

// Import CSV Student Data From EMU
// This is responsible for giving each student their usernames so that they can login
router.post("/admin/import/sentral", controller.ImportFromEMU);

// Print Posters
router.get("/admin/posters.pdf", controller.GeneratePosters);

// Get active status
router.get("/admin/active-status", controller.GetActiveStatus);

// Set active status
router.post("/admin/active-status", controller.SetActiveStatus);

// Get teachers completion status
router.get("/admin/check", controller.GetTeacherCompletion);

// Import student Photos
router.post("/admin/import/photos", controller.ImportStudentPhotos);

// Import CSV Timetable Data From Edval (DEPRECATED)
// This is responsible for creating each student/teacher/subject combo for the current period
//router.post("/admin/import/edval", controller.ImportFromEdval);

// Import JSON Data from old RAP system (DEPRECATED)
// This should be a one off process to convert from the old system to this one
//router.post("/admin/import/old", controller.ImportFromOldRap);

// Import CSV Student Data From LMBR (DEPRECATED)
// This is responsible for adding student gender to their record
//router.post("/admin/import/lmbr", controller.ImportFromLMBR);

// Import CSV Student Data From Spreadsheet (DEPRECATED)
//router.post("/admin/import/spreadsheet", controller.ImportFromOldSpreadsheet);

// Initial setup for Admin Table (USE ONCE ONLY!)
//router.post("/admin/setup", controller.AdminSetup);



module.exports = router.routes();
