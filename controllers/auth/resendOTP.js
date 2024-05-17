import asyncHandler from "express-async-handler";


const resendOTP = asyncHandler(async (req, res) => {

console.log(req.user)
  try {

    res.send("resend")
   
  } catch (error) {
    // Log error and send internal server error response
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

export default resendOTP;
