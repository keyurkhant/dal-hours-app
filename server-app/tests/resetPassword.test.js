const bcrypt = require('bcrypt');
const User = require('../src/models/user'); 
const response = require('../src/utils/response'); 
const sendEmail = require('../src/utils/mailer');
const resetPassword = require('../src/api/controllers/auth/resetPassword'); 

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));
jest.mock('../src/models/user.js', () => ({ 
  findOne: jest.fn(),
}));
jest.mock('../src/utils/response', () => jest.fn()); 
jest.mock('../src/utils/mailer', () => jest.fn());

describe('resetPassword', () => {
  let mockUser;
  let req;
  let res;

  beforeEach(() => {
    mockUser = {
      email: 'test@example.com',
      otp: '123456',
      password: 'hashedpassword',
      save: jest.fn().mockResolvedValue(true),
    };
    req = {
      body: {
        email: 'test@example.com',
        otp: '123456',
        password: 'newpassword',
        confirmPassword: 'newpassword',
      },
    };
    res = {
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };

    User.findOne.mockClear();
    bcrypt.hash.mockClear();
    sendEmail.mockClear();
    response.mockClear();
  });

  it('should reset the password for valid OTP and matching passwords', async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.hash.mockResolvedValue('newhashedpassword');

    await resetPassword(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
    expect(mockUser.save).toHaveBeenCalled();
    expect(sendEmail).toHaveBeenCalledWith('test@example.com', expect.any(String), expect.any(String));
    expect(response).toHaveBeenCalledWith(res, 200, true, { message: "Password reset successful" });
  });

  it('should return an error if the user is not found', async () => {
    User.findOne.mockResolvedValue(null);

    await resetPassword(req, res);

    expect(response).toHaveBeenCalledWith(res, 404, false, { message: "User not found" });
  });

  it('should return an error if the OTP does not match', async () => {
    User.findOne.mockResolvedValue({ ...mockUser, otp: 'wrongotp' });

    await resetPassword(req, res);

    expect(response).toHaveBeenCalledWith(res, 400, false, { message: "Invalid OTP" });
  });
});