import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const authenticate = asyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      res.status(401).json({ message: "Not authorized, please login" });
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    next();
  } catch (error) {
    res.status(401);
    throw new Error(error);
  }
});

export const authorize = (requiredRole) => {
  return (req, res, next) => {
    const user = req.user;
    const { role } = user;

    console.log(role)

    if (role === requiredRole) {
      // User has the required role, proceed to the next middleware
      next();
    } else {
     
      res
        .status(403)
        .json({ message: "You are not authorized to access this resource" });
    }
  };
};
