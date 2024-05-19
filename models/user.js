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
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email address!`
      }
    },
    password: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    otp: { 
      code: { type: String }, // OTP code
      expires: { type: Date },
    
    }, 
    isEmailVerified: { type: Boolean, default: false } // Field to indicate whether email is verified
  },
  { timestamps: true }
);

// Check if the model already exists before defining it
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
