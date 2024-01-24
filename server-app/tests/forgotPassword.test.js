const forgotPassword = require('../src/api/controllers/auth/forgotPassword.js');
const User = require('../src/models/user.js');
const response = require('../src/utils/response.js');
const sendEmail = require('../src/utils/mailer.js');
const generateOTP = require('../src/utils/generateOTP.js');

jest.mock('../src/models/user.js', () => ({
  findOne: jest.fn(),
}));
jest.mock('../src/utils/response.js', () => jest.fn());
jest.mock('../src/utils/mailer.js', () => jest.fn());
jest.mock('../src/utils/generateOTP.js', () => jest.fn());

describe('forgotPassword', () => {
  beforeEach(() => {
    User.findOne.mockClear();
    response.mockClear();
    sendEmail.mockClear();
    generateOTP.mockClear();
  });

  it('should send an OTP if the user is found', async () => {
    const req = { body: { email: 'test@example.com' } };
    const res = {};
    User.findOne.mockResolvedValue({ email: 'test@example.com', save: jest.fn() });
    generateOTP.mockReturnValue('123456');
    response.mockReturnValue('some response'); 
    sendEmail.mockResolvedValue(true);

    await forgotPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(generateOTP).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledWith('test@example.com', expect.any(String), expect.any(String));
    expect(response).toHaveBeenCalledWith(res, 200, true, { message: "OTP sent via email" });
  });

  it('should return an error if the user is not found', async () => {
    const req = { body: { email: 'test@example.com' } };
    const res = {};
    User.findOne.mockResolvedValue(null);

    await forgotPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(response).toHaveBeenCalledWith(res, 404, false, { message: "User not found" });
  });
});
