import asyncHandler from "express-async-handler";
import JobApplication from "../../models/application.js";
import sendApplicationStatusUpdateEmail from "../../services/communication/sendApplicationStatusUpdateEmail.js";
import User from "../../models/user.js";
import moment from "moment";
import cron from 'node-cron';

const interviewSchedule = asyncHandler(async (req, res) => {
    try {
        const { startTime, endTime, venue, instructions, reminderMinutes } = req.body;

        if (!startTime || !endTime) {
            return res.status(400).json({ error: 'startTime and endTime are required' });
        }

        // Use Moment.js to parse and format the dates
        const start = moment(startTime);
        const end = moment(endTime);

        // Calculate duration using Moment.js
        const duration = moment.duration(end.diff(start));
        const durationHours = Math.floor(duration.asHours());
        const durationMinutes = Math.floor(duration.asMinutes()) % 60;

        // Format dates and times
        const formattedStart = start.format('MMMM D, YYYY h:mm A'); // Example: August 17, 2024 2:00 PM
        const formattedEnd = end.format('MMMM D, YYYY h:mm A'); // Example: August 17, 2024 3:00 PM

        // Log formatted output
        let durationMessage = 'Duration:';

        if (durationHours >= 1) {
            durationMessage += ` ${durationHours} hour(s)`;
        }
        
        if (durationMinutes >= 1) {
            durationMessage += durationHours > 0 ? `, ${durationMinutes} minute(s)` : ` ${durationMinutes} minute(s)`;
        }
        
        console.log(durationMessage);
        console.log('Venue:', venue);

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
                await sendApplicationStatusUpdateEmail(applicant.email, application.status);
           
            }

            console.log(reminderMinutes);

            // Schedule the reminder if `reminderMinutes` is provided
            if (reminderMinutes) {
                const reminderTime = start.clone().subtract(reminderMinutes, 'minutes');

                // Use cron expression to schedule the reminder
                const reminderTimeCron = `${reminderTime.minute()} ${reminderTime.hour()} ${reminderTime.date()} ${reminderTime.month() + 1} *`;

                console.log('Scheduling reminder for:', reminderTime.toString());

                cron.schedule(reminderTimeCron, () => {
                    console.log('Reminder triggered at:', new Date().toString());
                    sendApplicationStatusUpdateEmail(applicant.email, 'Upcoming Interview Reminder');
                }, {
                    scheduled: true,
                    timezone: "Africa/Johannesburg" // Ensure scheduling occurs in the correct timezone
                });
            }
        }

        return res.json({ 
            application, 
            formattedStart, 
            formattedEnd, 
            durationHours, 
            durationMinutes 
        });
    } catch (error) {
        console.error("Error scheduling interview:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default interviewSchedule;
