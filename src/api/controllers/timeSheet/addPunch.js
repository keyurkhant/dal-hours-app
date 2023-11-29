const Timesheet = require("../../../models/timesheet");
const response = require("../../../utils/response");

async function addPunchTime(req, res) {
  try {
    const { userId, approverId, courseId } = req.body;

    const startTime = Math.floor(new Date().getTime() / 1000);
    const endTime = 0;
    const totalHours = 0;
    const isOverTime = false;
    const isApproved = true;

    const newTimesheet = new Timesheet({
      userId,
      approverId,
      courseId,
      startTime,
      endTime,
      totalHours,
      isOverTime,
      isApproved,
    });

    // Save the timesheet entry to the database
    await newTimesheet.save();

    const instanceIdAutoCreated = newTimesheet.instanceId !== undefined;
    console.log(instanceIdAutoCreated);

    // Respond with a success message
    return response(res, 201, true, {
      message: "Punch time added successfully",
      instanceId: newTimesheet._id,
    });
  } catch (error) {
    console.error("Error adding punch time", error);
    // Respond with an error message
    return response(res, 500, false, {
      message: "Failed to add punch time",
    });
  }
}

module.exports = addPunchTime;
