const Timesheet = require("../../../models/timesheet");
const response = require("../../../utils/response");

async function approve(req, res) {
  const { userId, courseId, approverId } = req.body;
  console.log({ userId, courseId, approverId });
  try {
    if (!userId || !courseId || !approverId) {
      throw new Error("Missing required parameters");
    }

    const matchingTimesheets = await Timesheet.find({
      userId,
      courseId,
      approverId,
      isApproved: false,
    });

    if (matchingTimesheets.length === 0) {
      throw new Error("No matching timesheets found");
    }

    for (const timesheet of matchingTimesheets) {
      timesheet.isApproved = true;
      await timesheet.save();
    }

    return response(res, 200, true, {
      success: true,
      message: "Timesheets approved successfully",
    });
  } catch (error) {
    console.error("Error approving timesheets", error);
    return response(res, 500, false, {
      success: false,
      message: "Failed to approve timesheets",
      error: error.message,
    });
  }
}

module.exports = approve;
