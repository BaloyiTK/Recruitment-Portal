//registerController.js
import asyncHandler from "express-async-handler";
import logoutUser from "../../services/auth/logout/logoutUser.js";

const logout = asyncHandler(async (req, res) => {
  try {
   await logoutUser(res);
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default logout;
