const Course = require('../src/models/course');
const punchOut = require('../src/api/controllers/timeSheet/punchOut');
const Timesheet = require('../src/models/timesheet');
const response = require('../src/utils/response');

jest.mock('../src/models/timesheet', () => ({
  findById: jest.fn(),
}));
jest.mock('../src/models/course', () => ({
  findById: jest.fn(),
}));
jest.mock('../src/utils/response', () => jest.fn());

describe('punchOut', () => {
  const instanceId = 'timesheetId';
  const courseId = 'courseId';
  const userId = 'userId';
  const mockTimesheet = {
    instanceId,
    userId,
    courseId,
    startTime: new Date().getTime() / 1000 - 2 * 3600, 
    save: jest.fn().mockResolvedValue(true),
  };
  const mockCourse = {
    _id: courseId,
    members: [{ memberId: userId, maxHours: 10 }],
  };

  const req = {
    body: { instanceId },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    Timesheet.findById.mockClear();
    Course.findById.mockClear();
    response.mockClear();
  });

  it('should successfully punch out and save the timesheet', async () => {
    Timesheet.findById.mockResolvedValue(mockTimesheet);
    Course.findById.mockResolvedValue(mockCourse);

    await punchOut(req, res);

    expect(Timesheet.findById).toHaveBeenCalledWith(instanceId);
    expect(Course.findById).toHaveBeenCalledWith(courseId);
    expect(mockTimesheet.save).toHaveBeenCalled();
    expect(response).toHaveBeenCalledWith(res, 200, true, expect.any(Object));
  });

  it('should return an error if the timesheet is not found', async () => {
    Timesheet.findById.mockResolvedValue(null);

    await punchOut(req, res);

    expect(Timesheet.findById).toHaveBeenCalledWith(instanceId);
    expect(response).toHaveBeenCalledWith(res, 404, false, {
      message: "Timesheet not found",
    });
  });
});
