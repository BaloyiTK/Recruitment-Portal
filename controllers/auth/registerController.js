//registerController.js
import asyncHandler from "express-async-handler";
import validateFields from "../../services/auth/register/validateFields.js";
import validateEmail from "../../utils/validateEmail.js";
import checkExistingUser from "../../services/auth/register/checkExistingUser.js";
import validatePassword from "../../services/auth/register/validatePassword.js";
import registerUser from "../../services/auth/register/registerUser.js";

const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body

  try {
    validateFields(username, email, password);
    validateEmail(email);
    await checkExistingUser(email);
    validatePassword(password);
    await registerUser( username, email, password);
    return res.status(201).json({ message: "User registration successful!" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default register;
