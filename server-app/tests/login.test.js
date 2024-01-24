const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../src/models/user.js');
const response = require('../src/utils/response.js');
const login = require('../src/api/controllers/auth/login');

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
}));
jest.mock('../src/models/user.js', () => ({
  findOne: jest.fn(),
}));
jest.mock('../src/utils/response.js', () => jest.fn());

describe('login', () => {
  const mockUser = {
    _id: 'user123',
    email: 'test@example.com',
    password: 'hashedpassword',
    name: 'Test User',
    role: 'user',
    save: jest.fn(),
  };

  const req = {
    body: {
      email: 'test@example.com',
      password: 'password123',
    },
  };
  const res = {
    send: jest.fn(),
    status: jest.fn().mockReturnThis(),
  };

  beforeEach(() => {
    User.findOne.mockClear();
    bcrypt.compare.mockClear();
    jwt.sign.mockClear();
    response.mockClear();
  });

  it('should return a token for valid credentials', async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    const fakeToken = 'fakeToken123';
    jwt.sign.mockReturnValue(fakeToken);
    response.mockReturnValueOnce({});

    await login(req, res);

    expect(User.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    expect(bcrypt.compare).toHaveBeenCalledWith('password123', mockUser.password);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser._id },
      process.env.SECRET_KEY,
      { expiresIn: '30d' }
    );
    expect(response).toHaveBeenCalledWith(res, 200, true, {
      token: fakeToken,
      email: mockUser.email,
      name: mockUser.name,
      role: mockUser.role,
      userId: mockUser._id,
    });
  });

  it('should respond with an error for invalid email', async () => {
    User.findOne.mockResolvedValue(null);
    await login(req, res);
    expect(response).toHaveBeenCalledWith(res, 401, true, { message: "Invalid email or password" });
  });

  it('should respond with an error for invalid password', async () => {
    User.findOne.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false);

    await login(req, res);

    expect(response).toHaveBeenCalledWith(res, 401, true, { message: "Invalid email or password" });
  });
});
