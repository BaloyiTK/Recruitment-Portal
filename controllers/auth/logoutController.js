// controllers/registerController.js
import asyncHandler from "express-async-handler";

const logout = asyncHandler(async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default logout;
