import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, required: true },
  middleName: { type: String},
  lastName: { type: String, required: true },
  location: {
    city: { type: String },
    address: { type: String },
    province: { type: String },
    street: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  email: { type: String, required: true },
  cellNumber: { type: String },
  altNumber: { type: String },
  contactNumber: { type: String,  required:true },
  disabilityStatus: { type: String },
  citizenship: { type: String },
  skills: [{ type: String }],
  attendedProgram: { type: Boolean }, 
  hasExprience: { type: Boolean },
  status: { type: String },
  position : { type: String },
  qualificationDocuments : { type: String },
  roleDescription: { type: String },
  experience: [
    {
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      employmentType: { type: String, enum: [ "full-time", "part-time", "contract", "temporary","internship"] },
      responsibilities: { type: String },
    },
  ],
  education: [
    {
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String },
      startDate: { type: Date, required: true },
      endDate: { type: Date },
      modules: { type: String },
    },
  ],
  resume: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
