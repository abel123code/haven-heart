import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
    },
    password: {
      type: String,
      // Password is required only for email/password users
      required: function () {
        return !this.googleId;
      },
    },
    googleId: {
      type: String, // To link Google accounts if needed
      unique: true,
      sparse: true,
    },
    image: {
      type: String,
      default: '', // Set a default image or handle uploads
    },
    resetToken: {
      type: String,
      required: false
    },
    resetTokenExpiry: {
      type: Date,
      required: false
    },
    isVerified: { 
      type: Boolean, 
      default: false 
    },
    verificationToken: { 
      type: String 
    },
    verificationTokenExpiry: { 
      type: Date 
    },
    verificationRequests: { 
      type: Number, 
      default: 0 
    },
    lastVerificationRequest: { type: Date },
    firstTimeLogin: {
      type: Boolean,
      default: true,
    },
    preferences: {
      focusAreas: { type: [String], required: true, default: [] }, // Changed to array
      challenges: { type: [String], required: true, default: [] }, // Changed to array
      supportPreference: { type: String, required: false, default: "" }, // Remains a string
      eventInterests: { type: [String], required: true, default: [] }, // Changed to array
    },
  },
  { timestamps: true }
);

// Prevent recompilation of model in development
export default mongoose.models.User || mongoose.model('User', UserSchema);
