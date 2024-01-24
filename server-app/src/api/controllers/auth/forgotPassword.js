const User = require("../../../models/user");
const response = require("../../../utils/response");
const sendEmail = require("../../../utils/mailer");

const generateOTP = require("../../../utils/generateOTP");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return response(res, 404, false, { message: "User not found" });
    }

    const otp = generateOTP();
    user.otp = otp;

    const mailSubject = "OTP for Password Reset";
    const mailBody = `Your OTP for password reset is: ${otp}`;

    await sendEmail(email, mailSubject, mailBody);

    user.save();
    return response(res, 200, true, { message: "OTP sent via email" });
  } catch (error) {
    console.error("Error during forgot password", error);
    return response(res, 500, false, { message: "Forgot password failed" });
  }
};

module.exports = forgotPassword;
