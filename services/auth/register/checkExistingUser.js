import User from "../../../models/user.js";

const checkExistingUser = async (email) => {
  const userFound = await User.findOne({ email });
  if (userFound) {
    throw new Error("User already exists");
  }
};

export default checkExistingUser;
