const Course = require('../src/models/course.js');
const response = require('../src/utils/response.js');
const getCourseList = require('../src/api/controllers/course/getCourse.js');

jest.mock('../src/models/course.js', () => ({
  find: jest.fn(),
}));

describe('getCourseList', () => {
  const adminUser = {
    _id: 'adminId',
    role: 'ADMIN',
  };
  const instructorUser = {
    _id: 'instructorId',
    role: 'INSTRUCTOR',
  };
  const memberUser = {
    _id: 'memberId',
    role: 'STUDENT', 
  };
  const mockCourses = [
    { name: 'Course 1', instructorId: 'instructorId', members: [] },
  ];

  const res = {
    json: jest.fn(),
  };

  beforeEach(() => {
    Course.find.mockClear();
    res.json.mockClear();
  });

  it('should return all courses for ADMIN role', async () => {
    const req = { user: adminUser };
    Course.find.mockResolvedValue(mockCourses);

    await getCourseList(req, res);

    expect(Course.find).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(mockCourses);
  });

  it('should return courses taught by the instructor for INSTRUCTOR role', async () => {
    const req = { user: instructorUser };
    Course.find.mockResolvedValue(mockCourses.filter(course => course.instructorId === instructorUser._id));

    await getCourseList(req, res);

    expect(Course.find).toHaveBeenCalledWith({ instructorId: instructorUser._id });
    expect(res.json).toHaveBeenCalledWith(mockCourses.filter(course => course.instructorId === instructorUser._id));
  });

  it('should return courses where the user is a member for STUDENT role', async () => {
    const req = { user: memberUser };
    Course.find.mockResolvedValue(mockCourses.filter(course => course.members.some(member => member.memberId === memberUser._id)));

    await getCourseList(req, res);

    expect(Course.find).toHaveBeenCalledWith({ 'members.memberId': memberUser._id });
    expect(res.json).toHaveBeenCalledWith(mockCourses.filter(course => course.members.some(member => member.memberId === memberUser._id)));
  });
});
