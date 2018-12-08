const Router = require("koa-router");
const controller = require("./../../controllers").teacher;
const router = new Router();

router.get("/teachers", controller.GetAllTeachers);

module.exports = router.routes();
