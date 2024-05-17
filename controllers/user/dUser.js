import asyncHandler from "express-async-handler";
import User from "../../models/user.js";

// Define an async function for deleting a user
const dUser = asyncHandler(async (req, res) => {
  // Extract the user email from the request object
  const email = req.params.email;

  // Find the user with the specified email in the database
  const user = await User.findOne({ email });

  if (user) {
    // Delete the user from the database
    await User.deleteOne({ email });

    res.status(200).json({ message: "User deleted successfully" });
  } else {
    // If the user is not found, return an error message
    res.status(404);
    throw new Error("User not found!");
  }
});

// Export the deleteUser function for use in other files
export default dUser;
