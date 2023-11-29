const Timesheet = require("../../../models/timesheet");
const response = require("../../../utils/response");
const mongoose = require("mongoose");

async function patchTimesheet(req, res) {
  try {
    console.log(req.body);
    const {
      _id,
      approverId,
      courseId,
      startTime,
      endTime,
      totalHours,
      isOverTime,
      isApproved,
    } = req.body;

    console.log(_id);

    const timesheet = await Timesheet.findById((instanceId = _id));

    // Check if the timesheet exists
    if (!timesheet) {
      return response(res, 404, false, { message: "Timesheet not found" });
    }

    // Update the timesheet with provided parameters
    Object.keys(req.body).forEach((key) => {
      if (timesheet[key] !== undefined) {
        timesheet[key] = req.body[key];
      }
    });

    // Save the updated timesheet to the database
    await timesheet.save();

    // Respond with a success message
    return response(res, 200, true, {
      message: "Timesheet updated successfully",
      timesheetId: timesheet._id,
    });
  } catch (error) {
    console.error("Error updating timesheet", error);
    // Respond with an error message
    return response(res, 500, false, {
      message: "Failed to update timesheet",
    });
  }
}

module.exports = patchTimesheet;
