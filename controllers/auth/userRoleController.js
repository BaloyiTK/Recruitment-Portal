import asyncHandler from "express-async-handler";
import makeUserEditor from "../../services/auth/userRole/makeUserEditor.js";
import makeUserAdmin from "../../services/auth/userRole/makeUserAdmin.js";

export const makeEditor = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  try {
    makeUserEditor(userId);
    return res.status(200).json({ message: "User role updated to editor" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export const makeAdmin = asyncHandler(async (req, res) => {
    const { userId } = req.body;
  try {
   makeUserAdmin(userId)
   return res.status(200).json({ message: "User role updated to admin" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
