import asyncHandler from "express-async-handler";
import Log from "../../models/log.js";

// Define an async function to get all users
const getLogs = asyncHandler(async (req, res) => {
  try {

    const logs = await Log.find()

    res.send(logs)
   
  } catch (error) {
    // If an error occurs, handle it and send an error response
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default getLogs;
