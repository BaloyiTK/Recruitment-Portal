import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  lastName: { type: String, required: true },
  headline: { type: String },
  location: { type: String },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  email: { type: String, required: true },
  contactNumber: { type: String },
  disabilityStatus: { type: String },
  citizenship: { type: String },
  skills: [{ type: String }],
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      description: { type: String },
    },
  ],
  education: [
    {
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      description: { type: String },
    },
  ],
  resume: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
