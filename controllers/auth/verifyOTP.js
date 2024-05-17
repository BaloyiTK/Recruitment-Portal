import asyncHandler from "express-async-handler";
import User from "../../models/user.js";
import { generateAuthToken } from "../../utils/generateAuthToken.js";
import setAuthCookie from "../../utils/setAuthCookie.js";

const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { otp } = req.body;

    // Find user by OTP
    const user = await User.findOne({ "otp.code": otp });

    // Check if user is found
    if (!user) {
      return res.status(404).json({ message: "Invalid OTP" });
    }
    // Check if OTP has expired
    const otpExpiration = user.otp.expires;

   
    const currentTime = new Date();

    if (currentTime > otpExpiration) {
      // If OTP has expired, set it to null
      user.otp = null;
      await user.save();
      req.user = user;
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Update isEmailVerified and clear OTP after successful verification
    user.isEmailVerified = true;
    user.otp = null;
    await user.save();

    
    const token = generateAuthToken(user);

    // Set the authentication cookie
    setAuthCookie(res, token);

    // Respond with success messa
    //res.redirect("/login");
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    // Log error and send internal server error response
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default verifyOTP;
