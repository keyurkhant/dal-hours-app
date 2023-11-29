const Course = require("../../../models/course");
const response = require("../../../utils/response");

const registerCourse = async (req, res) => {
  try {
    const {
      name,
      CRN,
      term,
      instructorId,
      members,
    } = req.body;

    // Check if the course with the given courseId already exists
    const existingCourse = await Course.findOne({ name, CRN });
    if (existingCourse) {
      return response(res, 409, false, { message: "Course already exists" });
    }

    // Create a new course instance
    const newCourse = new Course({
      name,
      CRN,
      term,
      instructorId,
      members,
    });

    // Save the course to the database
    await newCourse.save();

    // Respond with a success message
    return response(res, 201, true, {
      message: "Course registered successfully",
      courseId: newCourse._id,
    });
  } catch (error) {
    console.error("Error during course registration", error);
    return response(res, 500, false, { message: "Course registration failed" });
  }
};

module.exports = registerCourse;
