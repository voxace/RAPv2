const Router = require("koa-router");
const controller = require("./../../controllers").subject;
const router = new Router();

// Get subject / all
router.get("/subject/all", controller.GetAllSubjects);

// Get subject / code / all
router.get("/subject/code/all", controller.GetAllSubjectCodes);

module.exports = router.routes();
