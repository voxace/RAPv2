const Router = require("koa-router");
const controller = require("./../../controllers").average;
const router = new Router();

// Test
router.get("/average/get", controller.GetPeriodAverages);

router.get("/average/calc", controller.CalculatePeriodAverages);

router.post("/average/name", controller.FindByNameAndSaveAverage);

module.exports = router.routes();
