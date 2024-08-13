import mongoose from "mongoose";

const { Schema } = mongoose;

const jobApplicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: "Job", // Assuming 'User' is the model for the person who posted the job
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // Reference the Profile model for the resume
  resume: {
    type: String,
    ref: "Profile",
    required: true,
  },
  coverLetter: {
    type: String,
    required: false, // Assuming the cover letter is optional
  },
  status: {
    type: String,
    enum: ["pending", "viewed", "accepted", "rejected", "interview", "offer", "hired"],
    default: "pending",
  },
  appliedDate: {
    type: Date,
    default: Date.now,
  },
});

const JobApplication = mongoose.model("JobApplication", jobApplicationSchema);

export default JobApplication;
