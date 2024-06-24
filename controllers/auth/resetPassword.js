import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import sendPasswordResetEmail from "../../services/communication/sendPasswordResetEmail.js";
import { passwordHash } from "../../utils/passwordHash.js";

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const token = req.query.token;
    const { password, passwordConfirm } = req.body;

    if (!password || !passwordConfirm) {
      return res
        .status(400)
        .json({
          error: "Both password and password confirmation are required.",
        });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({ error: "Passwords do not match." });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(verified.userId);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const hashedPassword = await passwordHash(password);
    user.password = hashedPassword;
    await user.save();

    sendPasswordResetEmail(user.email, null, "reset");

    return res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password:", error);

    return res.status(500).json(error.message);
  }
});

export default resetPassword;
