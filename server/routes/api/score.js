const Router = require("koa-router");
const controller = require("./../../controllers").score;
const router = new Router();

// CRUD
// Create Score / Student / Teacher / Class (when adding student to a class)
// Get Score / Student / Teacher / Class (when looking up a single score for a student/class combo)
// Update Score / ID (when giving the student a score)
// Update Score / Student / Teacher / Class (when giving the student a score)
// Delete Score / Student / Teacher / Class (when removing student from a class)
// Delete Score / ID (when removing student from a class)

// GET SCORES
// Get Scores / Student (for student, grouped by period)
// Get Scores / Class (for a particular class code)
// Get Scores / Teacher (for teacher, grouped by class, active period only)

// GET WHOLE SCHOOL AVERAGES
// Get Average / Whole (whole school, whole time period)
// Get Average / Whole / Current (whole school, current period)
// Get Average / Whole / Period (whole school, specified period)

// GET STUDENT AVERAGES
// Get Average / Student (single student, whole time period)
// Get Average / Student / Current (single student, current period)
// Get Average / Student / Period (single student, specified period)
// Get Average / Grade (all students, current period, grouped by student grade)
// Get Average / Subject / Grade (for a particular subject, current period, grouped by student grade)
// Get Average / Biggest Positive Change (since last period)
// Get Average / Biggest Negative Change (since last period)
// Get Average / Perfect Fives (this period)
// Get Average / Perfect Fives / Period (specified period)
// Get Average / Above Four (this period)
// Get Average / Above Four / Period (specified period)
// Get Average / Below Three (this period)
// Get Average / Below Three / Period (specified period)

router.post("/score", controller.post);
router.get("/score", controller.get);
router.put("/score", controller.put);
router.delete("/score", controller.delete);

module.exports = router.routes();
