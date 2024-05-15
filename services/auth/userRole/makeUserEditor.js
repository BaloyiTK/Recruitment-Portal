import User from "../../../models/user.js";

const makeUserEditor = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = "editor";
  await user.save();
};

export default makeUserEditor;
