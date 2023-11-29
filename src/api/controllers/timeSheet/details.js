const Timesheet = require("../../../models/timesheet");
const Course = require("../../../models/course");
const response = require("../../../utils/response");
const getTimesheetsByCourseAndUser = require("../../../utils/timesheet");

async function getCoursesByCourseId(courseId) {
  try {
    const course = await Course.find({ _id: courseId });
    return course[0];
  } catch (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }
}

async function getCoursesAndTimesheets(courseIds, userId) {
  try {
    const course = await getCoursesByCourseId(courseIds);
    if (course.length === 0) {
      return response(res, 500, false, {
        message: "No courses found for the given term.",
      });
    }

    const timesheets = await getTimesheetsByCourseAndUser(courseIds, userId);

    const response = {
      courseName: course.name,
      courseId: course._id,
      totalHours: timesheets.reduce((acc, ts) => acc + ts.totalHours, 0),
      maxHours: course.members.filter(
        (acc, member) => acc.memberId == userId
      )[0].maxHours,
      timeSheets: timesheets.map((ts) => ({
        id: ts._id,
        startTime: ts.startTime,
        endTime: ts.endTime,
        totalHours: ts.totalHours,
        isOverTime: ts.isOverTime,
      })),
    };

    return response;
  } catch (error) {
    console.error("Error fetching courses and timesheets:", error);
    throw error;
  }
}

async function details(req, res) {
  try {
    const { courseId, userId } = req.query;

    const result = await getCoursesAndTimesheets(courseId, userId);
    return response(res, 200, true, result);
    return result;
  } catch (error) {
    return response(res, 500, false, {
      message: "Failed to fetch data",
    });
  }
}

module.exports = details;
