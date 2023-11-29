const Course = require("../../../models/course");
const response = require("../../../utils/response");

const getCourseList = async (req, res) => {
  try {
    const user = req.user;
    let courseList = [];
    if (user.role == "ADMIN") {
      courseList = await Course.find();
    } else if (user.role == "INSTRUCTOR") {
      courseList = await Course.find({ instructorId: user._id });
    } else {
      courseList = await Course.find({
        "members.memberId": user._id,
      });
    }
    return res.json(courseList);
  } catch (error) {
    console.error("Error during course registration", error);
    return res.json([]);
  }
};

module.exports = getCourseList;
