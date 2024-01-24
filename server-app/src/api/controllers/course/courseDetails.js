const Course = require("../../../models/course");
const User = require("../../../models/user");
const response = require("../../../utils/response");
const getTimesheetsByCourseAndUser = require("../../../utils/timesheet");

const getCourseDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const courseDetails = await Course.findById(id);
    const returnData = { ...courseDetails }._doc;
    const instructor = await User.findById(courseDetails.instructorId);

    returnData.instructor = { name: instructor.name, email: instructor.email };

    const members = courseDetails.members.map(async (member, index) => {
      const data = await getTimesheetsByCourseAndUser(
        courseDetails._id.toString(),
        member.memberId
      );
      console.log(data);
      // console.log(data);
      const isApproved = data.some((e) => e.isApproved == false);

      const u = await User.findById(member.memberId);
      const time = data?.reduce((acc, ts) => acc + ts.totalHours, 0);
      const rd = { ...member }._doc;
      rd.completedHours = time;
      rd.name = u.name;
      rd.role = u.role;
      rd.isApproved = !isApproved;

      return rd;
    });

    Promise.all(members)
      .then((memberInfos) => {
        returnData.members = memberInfos;
        return response(res, 200, true, { ...returnData });
      })
      .catch((error) => {
        console.error("Error fetching member details", error);
      });
  } catch (error) {
    console.error(error);
  }
};

module.exports = getCourseDetails;
