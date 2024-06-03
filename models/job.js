import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    salary: { type: String, default: "Undisclosed" },
    description: { type: String, required: true },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    workExperience: { type: String, required: true }, // Work Experience field
    employmentType: { type: String, required: true }, // Employment Type field
    closingDate: { type: Date, required: true }, // Closing Date field
    requirements: { type: String, required: true }, // Requirements field
    skills: { type: [String], required: true }, // Skills field (assuming it's an array of strings)
  },
  { timestamps: true }
);

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

export default Job;
