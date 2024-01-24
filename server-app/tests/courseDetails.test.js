const Course = require('../src/models/course.js');
const User = require('../src/models/user.js');
const response = require('../src/utils/response.js');
const getTimesheetsByCourseAndUser = require('../src/utils/timesheet.js');
const getCourseDetails = require('../src/api/controllers/course/courseDetails');

jest.mock('../src/models/course.js', () => ({
  findById: jest.fn(),
}));
jest.mock('../src/models/user.js', () => ({
  findById: jest.fn(),
}));
jest.mock('../src/utils/response.js', () => jest.fn());
jest.mock('../src/utils/timesheet.js', () => jest.fn());

describe('getCourseDetails', () => {
  const mockCourseDetails = {
    _id: 'course123',
    instructorId: 'instructor123',
    members: [
      { memberId: 'member1' },
    ],
    _doc: { },
  };

  const mockInstructor = {
    _id: 'instructor123',
    name: 'Instructor Name',
    email: 'instructor@example.com',
  };

  const mockMember = {
    _id: 'member1',
    name: 'Member Name',
    role: 'Member Role',
  };

  const req = {
    params: {
      id: 'course123',
    },
  };
  const res = {
    send: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    Course.findById.mockClear();
    User.findById.mockClear();
    getTimesheetsByCourseAndUser.mockClear();
    response.mockClear();
  });

  it('should return course details with instructor and member information', async () => {
    Course.findById.mockResolvedValue(mockCourseDetails);
    User.findById.mockImplementation((id) => {
      if (id === mockCourseDetails.instructorId) {
        return Promise.resolve(mockInstructor);
      } else {
        return Promise.resolve(mockMember);
      }
    });
    getTimesheetsByCourseAndUser.mockResolvedValue([
      { isApproved: false, totalHours: 5 },
    ]);
    response.mockReturnValueOnce({});
    await getCourseDetails(req, res);
    expect(Course.findById).toHaveBeenCalledWith('course123');
    expect(User.findById).toHaveBeenCalledWith(mockCourseDetails.instructorId);
    expect(getTimesheetsByCourseAndUser).toHaveBeenCalledTimes(mockCourseDetails.members.length);
  });
});
