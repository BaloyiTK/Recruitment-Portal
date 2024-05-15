import bcrypt from "bcrypt";

export const passwordHash = async (password) => {

 // console.log(password)
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Using 10 salt rounds
    return hashedPassword;
  } catch (error) {
    throw new Error("Password hashing failed");
  }
};
