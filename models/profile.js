import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  profilePicture: { type: String, default: "" },
  firstName: { type: String, default: "" },
  middleName: { type: String, default: "" },
  idNumber: { type: String, default: "" },
  ethnicity: { type: String, default: "" },
  lastName: { type: String, default: "" },
  location: {
    city: { type: String, default: "" },
    address: { type: String, default: "" },
    province: { type: String, default: "" },
    street: { type: String, default: "" },
    zipCode: { type: String, default: "" },
    country: { type: String, default: "" },
  },
  dateOfBirth: { type: Date, default: null },
  gender: { type: String, default: "" },
  email: { type: String, required: true },
  cellNumber: {
    type: String,
    default: "",
 
  },
  altNumber: {
    type: String,
    default: "",
  
  },
  contactNumber: { type: String, default: "" },
  disabilityStatus: { type: String, default: "" },
  citizenship: { type: String, default: "" },
  skills: [{ type: String, default: "" }],
  attendedProgram: { type: Boolean, default: false },
  hasExperience: { type: Boolean, default: false },
  status: { type: String, default: "" },
  position: { type: String, default: "" },
  qualificationDocuments: { type: String, default: "" },
  otherDocuments: [{ type: String, default: "" }],
  roleDescription: { type: String, default: "" },
  experience: [
    {
      title: { type: String, default: "" },
      company: { type: String, default: "" },
      location: { type: String, default: "" },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
      employmentType: {
        type: String,
      
        default: ""
      },
      responsibilities: { type: String, default: "" },
    },
  ],
  education: [
    {
      institution: { type: String, default: "" },
      institutionType: { type: String, default: "" },
      degree: { type: String, default: "" },
      fieldOfStudy: { type: String, default: "" },
      startDate: { type: Date, default: null },
      endDate: { type: Date, default: null },
    },
  ],
  resume: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

profileSchema.index({ user: 1 }); // Indexing user for better query performance

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
