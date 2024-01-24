const Timesheet = require('../src/models/timesheet');
const response = require('../src/utils/response');
const approve = require('../src/api/controllers/timeSheet/approve');

jest.mock('../src/models/timesheet', () => ({
  find: jest.fn(),
}));
jest.mock('../src/utils/response', () => jest.fn());

describe('approve', () => {
  const req = {
    body: {
      userId: 'userId',
      courseId: 'courseId',
      approverId: 'approverId',
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(() => {
    Timesheet.find.mockClear();
    response.mockClear();
  });

  it('should approve timesheets successfully', async () => {
    const mockTimesheets = [
      { isApproved: false, save: jest.fn().mockResolvedValue(true) },
    ];
    Timesheet.find.mockResolvedValue(mockTimesheets);
    await approve(req, res);
    expect(Timesheet.find).toHaveBeenCalledWith({
      userId: 'userId',
      courseId: 'courseId',
      approverId: 'approverId',
      isApproved: false,
    });
    for (const mockTimesheet of mockTimesheets) {
      expect(mockTimesheet.save).toHaveBeenCalled();
    }
    expect(response).toHaveBeenCalledWith(res, 200, true, {
      success: true,
      message: "Timesheets approved successfully",
    });
  });

  it('should return an error if no matching timesheets found', async () => {
    Timesheet.find.mockResolvedValue([]);
    await approve(req, res);
    expect(Timesheet.find).toHaveBeenCalledWith({
      userId: 'userId',
      courseId: 'courseId',
      approverId: 'approverId',
      isApproved: false,
    });
    expect(response).toHaveBeenCalledWith(res, 500, false, {
      success: false,
      message: "Failed to approve timesheets",
      error: "No matching timesheets found",
    });
  });
});
