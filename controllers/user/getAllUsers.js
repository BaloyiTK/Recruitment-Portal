import asyncHandler from "express-async-handler";
import User from "../../models/user.js";

// Define an async function to get all users
const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const users = await User.find({}).select("-password");

    // If no users are found, return an empty array
    if (!users || users.length === 0) {
      res.status(404).json({ message: "No users found" });
      return;
    }

    // Send the formatted users array in the response
    res.status(200).json(users);
  } catch (error) {
    // If an error occurs, handle it and send an error response
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default getAllUsers;
