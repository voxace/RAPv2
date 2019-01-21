const Router = require("koa-router");
const controller = require("./../../controllers").subject;
const router = new Router();

// Get subject / all
router.get("/subject/all", controller.GetAllSubjects);

// Get subject / code / all
router.get("/subject/code/all", controller.GetAllSubjectCodes);

// Delete Subject / Teacher (when removing teacher from a class)
router.post("/subject/remove", controller.RemoveClass);

// Add Subject / Teacher (when adding teacher to a class)
router.post("/subject/add", controller.AddClass);

module.exports = router.routes();
