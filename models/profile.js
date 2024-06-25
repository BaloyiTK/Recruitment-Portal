import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  firstName: { type: String, required: true },
  middleName: { type: String },
  idNumber: { type: String , required: true },
  Ethnicity: { type: String, required: true},
  lastName: { type: String, required: true },
  location: {
    city: { type: String },
    address: { type: String },
    province: { type: String },
    street: { type: String },
    zipCode: { type: String },
    country: { type: String },
  },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  email: { type: String, required: true },
  cellNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid 10-digit phone number!`,
    },
    required: [true, "Cell number is required"],
  },
  altNumber: {
    type: String,
    validate: {
      validator: function (v) {
        return /^\d{10}$/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid 10-digit phone number!`,
    }
  },
  contactNumber: { type: String },
  disabilityStatus: { type: String },
  citizenship: { type: String },
  skills: [{ type: String }],
  attendedProgram: { type: Boolean },
  hasExprience: { type: Boolean },
  status: { type: String },
  position: { type: String },
  qualificationDocuments: { type: String },
  otherDocuments: [{ type: String }],
  roleDescription: { type: String },
  experience: [
    {
      title: { type: String },
      company: { type: String},
      location: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
      employmentType: {
        type: String,
        enum: ["full-time", "part-time", "contract", "temporary", "internship"],
      },
      responsibilities: { type: String },
    },
  ],
  education: [
    {
      institution: { type: String },
      institutionType: { type: String },
      degree: { type: String },
      fieldOfStudy: { type: String },
      startDate: { type: Date },
      endDate: { type: Date },
    },
  ],
  resume: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
