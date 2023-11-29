const bcrypt = require("bcrypt");
const User = require("../../../models/user");
const response = require("../../../utils/response");
const sendEmail = require("../../../utils/mailer");

const resetPassword = async (req, res) => {
  try {
    const { otp, email, password, confirmPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 404, false, { message: "User not found" });
    }

    if (user.otp !== otp) {
      return response(res, 400, false, { message: "Invalid OTP" });
    }

    if (password !== confirmPassword) {
      return response(res, 409, false, { message: "Password doesn't match" });
    }

    const hashedPassword = await bcrypt.hash(confirmPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    await user.save();
    const mailSubject = "Password Reset Successful";
    const mailBody = "Your password has been successfully reset.";

    await sendEmail(email, mailSubject, mailBody);

    return response(res, 200, true, { message: "Password reset successful" });
  } catch (error) {
    console.error("Error during password reset", error);
    return response(res, 500, false, { message: "Password reset failed" });
  }
};

module.exports = resetPassword;
