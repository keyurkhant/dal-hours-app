const Timesheet = require('../src/models/timesheet');
const response = require('../src/utils/response');
const patchTimesheet = require('../src/api/controllers/timeSheet/updatePunch');

jest.mock('../src/models/timesheet', () => ({
  findById: jest.fn(),
}));
jest.mock('../src/utils/response', () => jest.fn());

describe('patchTimesheet', () => {
  const timesheetId = 'timesheetId';
  const mockTimesheet = {
    _id: timesheetId,
    save: jest.fn().mockResolvedValue(true),
  };

  const req = {
    body: {
      _id: timesheetId,
      approverId: 'approverId',
      courseId: 'courseId',
      startTime: new Date().getTime() / 1000,
      endTime: new Date().getTime() / 1000 + 3600,
      totalHours: 1,
      isOverTime: false,
      isApproved: true,
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    Timesheet.findById.mockClear();
    response.mockClear();
  });

  it('should successfully update a timesheet', async () => {
    Timesheet.findById.mockResolvedValue(mockTimesheet);

    await patchTimesheet(req, res);

    expect(Timesheet.findById).toHaveBeenCalledWith(timesheetId);
    expect(mockTimesheet.save).toHaveBeenCalled();
    expect(response).toHaveBeenCalledWith(res, 200, true, {
      message: "Timesheet updated successfully",
      timesheetId: timesheetId,
    });
  });

  it('should return an error if the timesheet is not found', async () => {
    Timesheet.findById.mockResolvedValue(null);

    await patchTimesheet(req, res);

    expect(Timesheet.findById).toHaveBeenCalledWith(timesheetId);
    expect(response).toHaveBeenCalledWith(res, 404, false, {
      message: "Timesheet not found",
    });
  });
});
