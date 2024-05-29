// registerController.js

import asyncHandler from "express-async-handler";
import validateFields from "../../services/auth/register/validateFields.js";
import validateEmail from "../../utils/validateEmail.js";
import checkExistingUser from "../../services/auth/register/checkExistingUser.js";
import validatePassword from "../../services/auth/register/validatePassword.js";
import { registerUser } from "./otpController.js";

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Validate user input
    validateFields(username, email, password);
    validateEmail(email);
    await checkExistingUser(email);
    validatePassword(password);
    await registerUser(username, email, password);

    return res.status(201).json({
      message:
        "User registration successful! An email has been sent to your inbox with instructions to verify your email address. Please follow the instructions to complete the registration process.",
    });
  } catch (error) {
    return res.status(400).json({ message: error.message })
  }
});

export default register;
