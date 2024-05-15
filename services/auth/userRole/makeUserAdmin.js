import User from "../../../models/User.js";

const makeUserAdmin = async (id) => {
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.role = "admin";
  await user.save();
};

export default makeUserAdmin;
