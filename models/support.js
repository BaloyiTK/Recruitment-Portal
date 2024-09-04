import mongoose from "mongoose";

// Define the support schema
const supportSchema = new mongoose.Schema(
  {
    ticketId: { 
      type: String, 
      unique: true, 
      required: true 
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      default: null // Allow anonymous submissions
    },
    name: { 
      type: String, 
      trim: true 
    },
    email: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    subject: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['open', 'closed', 'in_progress', 'on_hold'], 
      default: 'open' 
    },
    priority: { 
      type: String, 
      enum: ['low', 'medium', 'high', 'urgent'], 
      default: 'medium' 
    },
    type: { 
      type: String, 
      enum: ['general_query', 'feature_request', 'bug_report', 'system_issue'], 
      required: true 
    },
    resolution: { 
      type: String 
    },
    screenshot: { 
      type: String 
    }
  },
  { timestamps: true } // Add timestamps
);



// Check if the model already exists before defining it
const Support = mongoose.models.Support || mongoose.model("Support", supportSchema);

export default Support;
