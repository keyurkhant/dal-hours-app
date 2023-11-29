const bcrypt = require("bcrypt");

const User = require("../../../models/user");
const response = require("../../../utils/response");

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response(res, 409, false, { message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();
    return response(res, 201, true, {
      message: "User created successfully",
      userId: newUser._id,
    });
  } catch (error) {
    console.error("Error during registration", error);
    return response(res, 500, false, { message: "Registration failed" });
  }
};

module.exports = register;
