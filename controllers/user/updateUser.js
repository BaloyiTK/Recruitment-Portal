import asyncHandler from "express-async-handler";
import User from "../../models/user.js";
import { passwordHash } from "../../utils/passwordHash.js";

const updateUser = asyncHandler(async (req, res) => {


  try {

    const { username, email, password, passwordConfirmation } = req.body;

    // Check if passwords match
    if (password !== passwordConfirmation) {
      return res.status(400).send("Passwords do not match");
    }
  
    const userId = req.params.id;
    // Find the user with the specified ID in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send("User not found");
    }
    

    // Update user information
    user.username = username || user.username;
    user.email = email || user.email;
    
    // Update password only if a new one is provided
    if (password) {
      const hashedPassword = await passwordHash(password);
      user.password = hashedPassword;
    }

    // Save the updated user to the database
    await user.save();

    return res.send(user);
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).send("Internal Server Error");
  }
});

export default updateUser;
