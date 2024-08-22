import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      // Using Mongoose built-in validator for email format
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (value) {
          const passwordRegex =
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/\\~-]).{8,}$/;
          return passwordRegex.test(value);
        },
        message:
          "The password must be at least 8 characters long and contain at least one uppercase letter (A-Z), one lowercase letter (a-z), one numeric digit (0-9), and one special character (!@#$%^&*()_+{}[]:;<>,.?/\\~-).",
      },
    },
    accountType: { type: String, enum: ["recruiter", "jobseeker"] },
    otp: {
      code: { type: String }, // OTP code
      expires: { type: Date },
    },
    isEmailVerified: { type: Boolean, default: false }, 
    accountStatus: { type: String, enum: ['active', 'inactive', 'banned'], default: 'active' },
  },
   
  { timestamps: true }
);

// Check if the model already exists before defining it
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
