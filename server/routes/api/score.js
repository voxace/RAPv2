const Router = require("koa-router");
const controller = require("./../../controllers").score;
const router = new Router();

router.post("/score", controller.post);
router.get("/score", controller.get);
router.put("/score", controller.put);
router.delete("/score", controller.delete);

module.exports = router.routes();
