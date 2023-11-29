const router = require("express").Router();

const auth = require("./auth/index");
const course = require("./course/index");
const user = require("./user/index");
const timesheet = require("./timeSheet/index");

router.use("/auth", auth);
router.use("/course", course);
router.use("/user", user);
router.use("/timeSheet", timesheet);

module.exports = router;
