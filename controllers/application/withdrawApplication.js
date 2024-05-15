import asyncHandler from "express-async-handler";
import JobApplication from "../../models/application.js";

const withdrawApplication = asyncHandler(async (req, res) => {
  try {
    const appId = req.params.appId;

    const application = await JobApplication.findByIdAndDelete(appId)
    
    if (!application) {
        return res.status(404).json({ message: "Application not found" });
    }

    res.status(200).send({ message: "Application withdrawn" });

  } catch (error) {
    res.status(500).send(error);
  }
});

// Export the createProfile function
export default withdrawApplication;
