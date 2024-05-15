import asyncHandler from "express-async-handler";
import User from "../../models/user.js";


// Define an async function for getting user details
const getLoggedInUser = asyncHandler(async (req, res) => {
  
  const userId = req.user.userId;

  const user = await User.findById(userId);
 
  if (user) {

    const { _id, username, email, role } = user;
    return res.status(200).json({ _id, username, email,role })
  } else {
    
    res.status(400);
    throw new Error("user not found!");
  }
});

// Export the getUser function for use in other files
export default getLoggedInUser;
