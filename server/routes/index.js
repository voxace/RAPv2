const Router = require("koa-router");
const router = new Router();
const api = new Router();

//const teacher = require("./teacher");
const student = require("./api/student");
const admin = require("./api/admin");
//const auth = require("./auth");
//const insights = require("./insights");

//api.use(teacher);
api.use(student);
api.use(admin);
//api.use(auth);
//api.use(insights);

router.use("/api", api.routes());

module.exports = router;
