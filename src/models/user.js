const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ADMIN", "INSTRUCTOR", "TA_MARKER"],
    default: "TA_MARKER",
    required: true,
  },
  mobile: {
    type: String,
    default: "",
  },
  otp: {
    type: String,
    default: "",
  },
  resetPasswordToken: {
    type: String,
    default: "",
  },
});

const User = mongoose.model("Users", userSchema);

module.exports = User;
