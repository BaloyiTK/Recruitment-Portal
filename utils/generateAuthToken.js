import jwt from "jsonwebtoken";

export const generateAuthToken = (user) => {
  // Ensure that user is a plain object

 
  const payload = {
    // Add properties from the user object as needed
    userId: user._id,
    username: user.username,
    email: user.email,
    role: user.role
    // Add other properties if required
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1000m" });

  return token;
};

