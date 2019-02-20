const Router = require("koa-router");
const controller = require("./../../controllers").admin;
const router = new Router();

// Import CSV Timetable Data From Edval
router.post("/admin/import/edval", controller.ImportFromEdval);

// Import JSON Data from old RAP system
router.post("/admin/import/old", controller.ImportFromOldRap);

// Initial setup for Admin Table
router.post("/admin/setup", controller.AdminSetup);

module.exports = router.routes();
