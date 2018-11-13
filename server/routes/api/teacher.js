const Router = require("koa-router");
const controller = require("./../../controllers").teacher;
const router = new Router();

router.get("/teacher", controller.Test);

module.exports = router.routes();
