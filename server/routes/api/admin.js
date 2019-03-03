const Router = require("koa-router");
const controller = require("./../../controllers").admin;
const router = new Router();

// Import CSV Timetable Data From Edval
// This is responsible for creating each student/teacher/subject combo for the current period
router.post("/admin/import/edval", controller.ImportFromEdval);

// Import CSV Student Data From EMU
// This is responsible for giving each student their usernames so that they can login
router.post("/admin/import/emu", controller.ImportFromEMU);

// Import CSV Student Data From LMBR
// This is responsible for adding student gender to their record
router.post("/admin/import/lmbr", controller.ImportFromLMBR);

// Import JSON Data from old RAP system
// This should be a one off process to convert from the old system to this one
router.post("/admin/import/old", controller.ImportFromOldRap);

// Initial setup for Admin Table
router.post("/admin/setup", controller.AdminSetup);

// Initial setup for Admin Table
router.get("/admin/posters.pdf", controller.GeneratePosters);

// Initial setup for Admin Table
router.get("/admin/active-status", controller.GetActiveStatus);

// Initial setup for Admin Table
router.post("/admin/active-status", controller.SetActiveStatus);

module.exports = router.routes();
