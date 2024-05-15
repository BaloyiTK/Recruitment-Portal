import bcrypt from "bcrypt";
import User from "../../../models/User.js";
import { generateToken } from "../../../utils/generateToken.js";
import setAuthCookie from "../../../utils/setAuthCookie.js";

const loginUser = async (res, email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user not found, throw an error
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    // If passwords don't match, throw an error
    if (!passwordMatch) {
      throw new Error("Invalid email or password");
    }

    // Generate a JWT token for the authenticated user
    const userWithoutPassword = { ...user.toJSON(), password: undefined };
    const token = generateToken(userWithoutPassword);

    // Set the authentication cookie
    setAuthCookie(res, token);

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export default loginUser;
