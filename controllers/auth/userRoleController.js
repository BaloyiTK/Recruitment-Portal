//userRoleController.js
import asyncHandler from "express-async-handler";
import User from "../../models/user.js";

export const makeEditor = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role == "editor") {

      return res.status(409).json({ message: "User already a editor!" });
      
    }
    user.role = "editor";
    await user.save();
    return res.status(200).json({ message: "User role updated to editor" });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: error.message });
  }
});

export const makeAdmin = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    const user = await User.findById(userId);

 

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role == "admin") {

      return res.status(409).json({ message: "User already an admin!" });
      
    }

    user.role = "admin";
    await user.save();
    return res.status(200).json({ message: "User role updated to admin" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
