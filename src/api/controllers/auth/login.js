const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../../../models/user");
const response = require("../../../utils/response");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 401, true, { message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return response(res, 401, true, { message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
      expiresIn: "30d",
    });
    return response(res, 200, true, {
      token,
      email: user.email,
      name: user.name,
      role: user.role,
      userId: user._id,
    });
  } catch (error) {
    console.log(error);
    return response(res, 500, false, { message: "Login failed" });
  }
};

module.exports = login;
