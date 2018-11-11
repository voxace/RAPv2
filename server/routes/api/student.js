const Router = require("koa-router");
const controller = require("./../../controllers").student;
const router = new Router();

router.post("/student", controller.post);
router.get("/student", controller.get);
router.put("/student", controller.put);
router.delete("/student", controller.delete);

module.exports = router.routes();
