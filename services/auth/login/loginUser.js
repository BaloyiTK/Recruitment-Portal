import bcrypt from "bcrypt";
import User from "../../../models/user.js";
import setAuthCookie from "../../../utils/setAuthCookie.js";
import { generateAuthToken } from "../../../utils/generateAuthToken.js";
import generateOTP from "../../../utils/generateOTP.js";
import sendRegistrationVerificationEmail from "../../communication/sendRegistrationVerificationEmail.js";

const loginUser = async (res, email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user not found, throw an error
    if (!user) {
      return { success: false, message: "Invalid email or password" };
    }

    

    // Check if the account is active
    if (user.accountStatus !== "active") {
      return { success: false, message: "Account not active, please contact support" };
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return { success: false, message: "Invalid email or password" };
    }

    // Check if the email is verified
    if (!user.isEmailVerified) {
      const otp = generateOTP();
      sendRegistrationVerificationEmail(email, otp);
      user.otp.code = otp;
      await user.save();
      return { success: false, message: "Email not verified. Please check your inbox for a verification email. If not received, check spam or request a new one." };
    }

    // Generate a JWT token for the authenticated user
    const userWithoutPassword = { ...user.toJSON(), password: undefined };
    const token = generateAuthToken(userWithoutPassword);

    // Set the authentication cookie
    setAuthCookie(res, token);

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    console.error("Error during login:", error.message); // Log the error for debugging
    return { success: false, message: "An unexpected error occurred. Please try again later." };
  }
};

export default loginUser;
