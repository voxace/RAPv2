const Router = require("koa-router");
const controller = require("./../../controllers").insights;
const router = new Router();

// Test
router.get("/insights/grade", controller.GetAveragesByGrade);

module.exports = router.routes();
