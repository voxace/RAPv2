const Router = require("koa-router");
const path = require("path");
const controller = require("./../../controllers").admin;
const router = new Router();

// Import routes
router.post("/admin/import/edval", controller.ImportFromEdval);

// RAP Periods
router.post("/admin/period/", controller.NewRapPeriod);
router.post("/admin/period/active", controller.SetActiveRapPeriod);
router.get("/admin/period/active", controller.GetActiveRapPeriod);

module.exports = router.routes();
