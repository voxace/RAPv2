const Router = require("koa-router");
const controller = require("./../../controllers").period;
const router = new Router();

// Create new RAP Period
router.post("/period/", controller.NewRapPeriod);

// Set Active RAP Period
router.post("/period/current", controller.SetCurrentRapPeriod);

// Gets the Current RAP Period
router.get("/period/current", controller.GetCurrentRapPeriod);

// Gets all RAP Periods
router.get("/period/all", controller.GetAllRapPeriods);

module.exports = router.routes();
