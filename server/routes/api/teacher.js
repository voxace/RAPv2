const Router = require("koa-router");
const controller = require("./../../controllers").teacher;
const router = new Router();

router.get("/teachers/names", controller.GetAllTeacherNames);

router.get("/teachers/all", controller.GetAllTeacherData);

module.exports = router.routes();
