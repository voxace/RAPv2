const Router = require("koa-router");
const router = new Router();
const api = new Router();

const admin = require("./api/admin");
const auth = require("./api/auth");
const insights = require("./api/insights");
const period = require("./api/period");
const score = require("./api/score");
const student = require("./api/student");
const teacher = require("./api/teacher");

api.use(admin);
api.use(auth);
api.use(insights);
api.use(period);
api.use(score);
api.use(student);
api.use(teacher);

router.use("/api", api.routes());

module.exports = router;
