const Router = require("koa-router");
const controller = require("./../../controllers").student;
const router = new Router();

// Add student / by name

// Delete student / by ID
// Delete student / by name

// Get student / by ID
// Get student / by name
// Get student / by username

// Get students / all
router.get("/students", controller.GetAllStudents);

router.post("/student", controller.post);
router.get("/student", controller.get);
router.put("/student", controller.put);
router.delete("/student", controller.delete);

module.exports = router.routes();
