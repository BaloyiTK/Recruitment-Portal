import asyncHandler from "express-async-handler";
import JobApplication from "../../models/application.js";
import sendApplicationStatusUpdateEmail from "../../services/communication/sendApplicationStatusUpdateEmail.js";
import User from "../../models/user.js";
import moment from "moment";
import cron from "node-cron";
import Notification from "../../models/notification.js";

const interviewSchedule = asyncHandler(async (req, res) => {
  try {
    const { startTime, duration, venue, instructions, reminderMinutes } =
      req.body;

    // Validate required fields
    if (!startTime || !duration || !venue) {
      return res
        .status(400)
        .json({ error: "startTime, duration, and venue are required" });
    }

    // Use Moment.js to parse the start time
    const start = moment(startTime);

    if (!start.isValid()) {
      return res.status(400).json({ error: "Invalid startTime format" });
    }

    // Validate duration
    if (isNaN(duration) || duration <= 0) {
      return res.status(400).json({ error: "Invalid duration format" });
    }

    // Calculate the end time based on duration
    const end = start.clone().add(duration, "minutes");

    // Format dates and times
    const formattedStart = start.format("MMMM D, YYYY h:mm A");
    const formattedEnd = end.format("MMMM D, YYYY h:mm A");

    // Calculate duration
    const durationHours = Math.floor(duration / 60);
    const durationMinutes = duration % 60;

    // Log formatted output
    let durationMessage = "Duration:";
    if (durationHours > 0) {
      durationMessage += ` ${durationHours} hour(s)`;
    }
    if (durationMinutes > 0) {
      durationMessage +=
        durationHours > 0
          ? `, ${durationMinutes} minute(s)`
          : ` ${durationMinutes} minute(s)`;
    }

    const { appId } = req.params;
    const { accountType } = req.user;

    const application = await JobApplication.findById(appId);

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    if (accountType === "recruiter" && application.status !== "rejected") {
      application.status = "interview";
      await application.save();

      const applicant = await User.findById(application.userId);
      if (applicant) {
        await sendApplicationStatusUpdateEmail(
          applicant.email,
          application.status
        );
        const notification = new Notification({
          userId: applicant._id, // Use applicant._id for the notification
          title: "Interview Schedule",
          message: `Interview Schedule.`,
        });

        await notification.save();

        if (reminderMinutes && reminderMinutes > 0) {
          const reminderTime = start
            .clone()
            .subtract(reminderMinutes, "minutes");

          if (reminderTime.isBefore(moment())) {
            console.log("Reminder time is in the past. Skipping scheduling.");
          } else {
            const reminderTimeCron = `${reminderTime.minute()} ${reminderTime.hour()} ${reminderTime.date()} ${
              reminderTime.month() + 1
            } *`;
            console.log("Scheduling reminder for:", reminderTime.toString());

            cron.schedule(
              reminderTimeCron,
              async () => {
                console.log("Reminder triggered at:", new Date().toString());
                await sendApplicationStatusUpdateEmail(
                  applicant.email,
                  "Upcoming Interview Reminder"
                );
              },
              {
                scheduled: true,
                timezone: "Africa/Johannesburg",
              }
            );
          }
        }
      }
    }

    return res.json({
      application,
      formattedStart,
      formattedEnd,
      durationHours,
      durationMinutes,
      instructions,
    });
  } catch (error) {
    console.error("Error scheduling interview:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default interviewSchedule;
