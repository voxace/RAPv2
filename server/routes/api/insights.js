const Router = require("koa-router");
const controller = require("./../../controllers").insights;
const router = new Router();

// By Grade
router.get("/insights/grade", controller.GetAveragesByGrade);

// By Cohort
router.get("/insights/cohort", controller.GetAveragesByCohort);

module.exports = router.routes();
