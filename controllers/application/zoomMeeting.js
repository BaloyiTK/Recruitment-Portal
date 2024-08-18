import axios from "axios";
import sendApplicationInterviewScheduleEmail from "../../services/communication/sendApplicationInterviewScheduleEmail.js";
import JobApplication from "../../models/application.js";
import User from "../../models/user.js";
import Profile from "../../models/profile.js";
import Job from "../../models/job.js";

const zoomMeeting = async (req, res) => {
  const { accessToken, startTime, duration, timezone } = req.body;

  if (!accessToken || !startTime || !duration || !timezone) {
    return res.status(400).send("Missing required parameters");
  }

  const { appId } = req.params;
  const { accountType, email, username } = req.user;

  try {
    const application = await JobApplication.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (accountType !== "recruiter") {
      return res.status(403).json({ message: "Unauthorized action" });
    }

    application.status = "interview";
    await application.save();

    const applicant = await User.findById(application.userId);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });
    }
    const profile = await Profile.findOne({ user: application.userId });
    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const job = await Job.findById(application.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

 
    const { firstName, lastName } = profile;
    const { title } = job;

    const applicationDetails = { firstName, lastName, title };
    const attendees = [email, applicant.email];


    const response = await axios.post(
      "https://api.zoom.us/v2/users/me/meetings",
      {
        topic : `Interview Invitation for ${firstName} ${lastName} - ${title} Position`,
        type: 2, // Scheduled meeting
        start_time: startTime, // Format: YYYY-MM-DDTHH:MM:SSZ
        duration, // Duration in minutes
        timezone,
        settings: {
          join_before_host: true, // Allow participants to join before the host
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    const meetingDetails = response.data;

    // Send invitations
    await sendApplicationInterviewScheduleEmail(
      attendees,
      meetingDetails,
      req.user,
      applicationDetails
    );

    res.status(201).json({ message: "Meeting created and invitations sent", meetingDetails });
  } catch (error) {
    console.error("Error creating meeting:", error.message);
    res.status(500).json({ message: "Error creating Zoom meeting", error: error.message });
  }
};

export default zoomMeeting;
