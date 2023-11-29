const Course = require("../../../models/course");
const Timesheet = require("../../../models/timesheet");
const response = require("../../../utils/response");

async function punchOut(req, res) {
  try {
    const { instanceId } = req.body;

    const existingTimesheet = await Timesheet.findById(instanceId);

    if (!existingTimesheet) {
      return response(res, 404, false, { message: "Timesheet not found" });
    }

    existingTimesheet.endTime = Math.floor(new Date().getTime() / 1000);
    existingTimesheet.totalHours = calculateTotalHours(
      existingTimesheet.startTime,
      existingTimesheet.endTime
    );
    const course = await Course.findById(existingTimesheet.courseId);
    const maxHours = course.members.filter(
      (member) => member.memberId === existingTimesheet.userId
    )[0]?.maxHours;

    const approvalNeeded = isApprovalNeeded(
      existingTimesheet.startTime,
      existingTimesheet.endTime,
      maxHours
    );
    existingTimesheet.approvalNeeded = approvalNeeded;

    if (existingTimesheet.totalHours > maxHours) {
      existingTimesheet.isOverTime = true;
      existingTimesheet.isApproved = false;
    } else {
      existingTimesheet.isOverTime = false;
      existingTimesheet.isApproved = true;
    }

    await existingTimesheet.save();

    const responseMessage = approvalNeeded
      ? "Punch out successful. Approval needed."
      : "Punch out successful. Approval not needed.";

    return response(res, 200, true, {
      message: responseMessage,
      timesheetId: existingTimesheet.instanceId,
      approvalNeeded: approvalNeeded,
    });
  } catch (error) {
    console.error("Error punching out", error);
    return response(res, 500, false, {
      message: "Failed to punch out",
    });
  }
}

function calculateTotalHours(startTime, endTime) {
  const millisecondsInHour = 3600;
  const startDateTime = new Date(startTime);
  const endDateTime = new Date(endTime);

  if (endDateTime < startDateTime) {
    return 0;
  }

  const totalMilliseconds = endDateTime - startDateTime;
  return totalMilliseconds / millisecondsInHour;
}

function isApprovalNeeded(startTime, endTime, maxHours) {
  const totalHours = calculateTotalHours(startTime, endTime);
  console.log("TOTAL HRS======>", totalHours);
  return totalHours > maxHours;
}

module.exports = punchOut;
