
import User from "../../../models/user.js";
import { passwordHash } from "../../../utils/passwordHash.js";

const registerUser = async (username, email, password) => {

  const hashedPassword = await passwordHash(password);
  
  await User.create({
    username,
    email,
    password: hashedPassword,
  });
};

export default registerUser;
