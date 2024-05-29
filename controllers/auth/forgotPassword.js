//registerController.js
import asyncHandler from "express-async-handler";
import User from "../../models/user.js";
import sendPasswordResetEmail from "../../services/communication/sendPasswordResetEmail.js";
import { generateAuthToken } from "../../utils/generateAuthToken.js";

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email });

    const token = generateAuthToken(user);

    sendPasswordResetEmail(email,token, "forgot")

    console.log("succses");

    res.send("succses");
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default forgotPassword;
