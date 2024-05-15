//registerController.js
import asyncHandler from "express-async-handler";
import validateFields from "../../services/auth/login/validateFields.js";
import validateEmail from "../../utils/validateEmail.js";
import loginUser from "../../services/auth/login/loginUser.js";
import checkNotExistingUser from "../../services/auth/login/checkNotExistingUser.js";


const login = asyncHandler(async (req, res) => {
  const {  email, password } = req.body;

  console.log(req.body)

  try {
    validateFields( email, password);
    
    validateEmail(email);
    await checkNotExistingUser(email);
    
    const loginResult = await loginUser(res, email, password);

      if (!loginResult.success) {
        throw new Error(loginResult.message);
      }

    return res.status(200).json({ message: "User Successfully logged in" });
 
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

export default login;
