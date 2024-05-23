
import asyncHandler from "express-async-handler";

export const cache = asyncHandler(async (req, res, next) => {
  try {

    console.log("User Data Cached")
  

    next();
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
});

