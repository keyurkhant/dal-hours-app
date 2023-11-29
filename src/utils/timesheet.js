const Timesheet = require("../models/timesheet");

const getTimesheetsByCourseAndUser = async (courseId, userId) => {
  try {
    const timesheets = await Timesheet.find({
      courseId: courseId,
      userId: userId,
    });
    return timesheets;
  } catch (error) {
    console.error("Error fetching timesheets:", error);
    throw error;
  }
};

module.exports = getTimesheetsByCourseAndUser;
