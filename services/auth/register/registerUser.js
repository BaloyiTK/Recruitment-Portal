import User from "../../../models/user.js";
import generateOTP from "../../../utils/generateOTP.js";
import { passwordHash } from "../../../utils/passwordHash.js";
import sendRegistrationVerificationEmail from "../../communication/sendRegistrationVerificationEmail.js";


const registerUser = async (username, email, password) => {
  const hashedPassword = await passwordHash(password);

  // Generate OTP and its expiration timestamp
  const otp = generateOTP(); // Generate OTP
  const otpExpiration = new Date(Date.now() + 30 * 60 * 1000); // Expiration time: 5 minutes from now

  await User.create({
    username,
    email,
    password: hashedPassword,
    otp: {
      code: otp,
      expires: otpExpiration,
    }
  });

  await sendRegistrationVerificationEmail(email, otp); // Send OTP via email
 // return otp; // Return the OTP
};

export default registerUser;
