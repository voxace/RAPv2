const Router = require("koa-router");
const controller = require("./../../controllers").insights;
const router = new Router();

// Test
router.get("/insights", controller.Test);

module.exports = router.routes();
