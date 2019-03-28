const Router = require("koa-router");
const controller = require("./../../controllers").average;
const router = new Router();

// Test
router.get("/average/get", controller.GetPeriodAverages);

//router.get("/average/calc", controller.CalculateCurrentPeriodAverages);

//router.get("/average/setup", controller.CalculateAllPeriodAverages);

//router.get("/average/year", controller.CalculateYearGroupAverages);

module.exports = router.routes();
