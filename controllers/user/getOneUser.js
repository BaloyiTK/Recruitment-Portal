import asyncHandler from "express-async-handler";
import User from "../../models/user.js";

// Define an async function to get one user by ID
const getOneUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;



  console.log("one user get")
  console.log(userId)
  try {
    // Ensure consistent import and use of asyncHandler
    const role = req.user.role;

    const user = await User.findById(userId).select("-password -otp");

    //console.log(req.user);
    console.log(user);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    res.status(200).json(user);
  } catch (error) {
    // Pass any error to the express-async-handler middleware
    throw new Error(error.message);
  }
});

export default getOneUser;
