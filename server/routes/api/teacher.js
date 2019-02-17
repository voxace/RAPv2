const Router = require("koa-router");
const controller = require("./../../controllers").teacher;
const router = new Router();

router.get("/teachers/names", controller.GetAllTeacherNames);

router.get("/teachers/all", controller.GetAllTeacherData);

router.post("/teacher", controller.AddOrUpdateTeacher);

router.delete("/teacher/:id", controller.RemoveTeacher);

module.exports = router.routes();
