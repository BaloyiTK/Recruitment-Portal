import asyncHandler from "express-async-handler";
import User from "../../models/user.js";
import sendPasswordResetEmail from "../../services/communication/sendPasswordResetEmail.js";
import { generateAuthToken } from "../../utils/generateAuthToken.js";

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(200).json({
        message:
          "If your email address is registered in our system, you will receive an email shortly with instructions on how to reset your password. Please check your inbox, including spam/junk folders, for further details",
      });
    }

    const token = generateAuthToken(user);

    sendPasswordResetEmail(email, token, "forgot");

    return res.status(200).json({
      message:
        "A password reset email has been sent to your email address. Please check your inbox, including spam/junk folders, for further instructions.",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default forgotPassword;
