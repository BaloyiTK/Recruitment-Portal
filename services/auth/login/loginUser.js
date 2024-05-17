import bcrypt from "bcrypt";
import User from "../../../models/user.js";
import setAuthCookie from "../../../utils/setAuthCookie.js";
import { generateAuthToken } from "../../../utils/generateAuthToken.js";
import { verify } from "crypto";
import verifyOTP from "../../../controllers/auth/verifyOtp.js";
import generateOTP from "../../../utils/generateOTP.js";
import sendRegistrationVerificationEmail from "../../communication/sendRegistrationVerificationEmail.js";

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

    // Check if the email is verified
    if (!user.isEmailVerified) {
      const otp = generateOTP();
      sendRegistrationVerificationEmail(email, otp);
      user.otp.code = otp;
      await user.save();
      throw new Error(
        "Email not verified, to complete registration, verify your email. Check your inbox for a verification code. If not received, check spam or request a new code"
      );
    }

    // Generate a JWT token for the authenticated user
    const userWithoutPassword = { ...user.toJSON(), password: undefined };
    const token = generateAuthToken(userWithoutPassword);

    // Set the authentication cookie
    setAuthCookie(res, token);

    return { success: true, user: userWithoutPassword };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export default loginUser;
