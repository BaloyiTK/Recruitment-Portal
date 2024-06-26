import User from "../../../models/user.js";

const checkNotExistingUser = async (email) => {
  const userFound = await User.findOne({ email });
  if (!userFound) {
    throw new Error("User not found");
  }
};

export default checkNotExistingUser;
