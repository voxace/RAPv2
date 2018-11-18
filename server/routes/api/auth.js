const Router = require("koa-router");
const controller = require("./../../controllers").auth;
const router = new Router();

// Login
router.post("/auth/login", controller.Login);

module.exports = router.routes();
