const Router = require("koa-router");
const controller = require("./../../controllers").score;
const router = new Router();

// CRUD
// Create Score / Student / Teacher / Class (when adding student to a class)
// Get Score / Student / Teacher / Class (when looking up a single score for a student/class combo)
// Update Score / ID (when giving the student a score)
router.patch("/score/id", controller.SetScore);
// Update Score / Student / Teacher / Class (when giving the student a score)
// Delete Score / Student / Teacher / Class (when removing student from a class)
// Delete Score / ID (when removing student from a class)

// GET SCORES
// Get Scores / Student (for student, grouped by period)
router.get("/scores/student/:name", controller.GetScoresByStudentName);
// Get Scores / Class (for a particular class code)
router.get("/scores/subject/:code", controller.GetScoresBySubjectID);
// Get Scores / Teacher / Period (for teacher, grouped by class)
router.get("/scores/teacher/:id/:period", controller.GetScoresByTeacher);

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

module.exports = router.routes();
