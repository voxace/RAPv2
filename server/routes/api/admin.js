const Router = require("koa-router");
const controller = require("./../../controllers").admin;
const router = new Router();

// Import CSV Timetable Data From Edval
router.post("/admin/import/edval", controller.ImportFromEdval);

module.exports = router.routes();
