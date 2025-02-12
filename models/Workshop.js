// models/Workshop.js

import mongoose from "mongoose";

const WorkshopSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    organiser: { type: String },
    shortDescription: String,
    fullDescription: String,
    sessions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Session" }],
    image: String,
    duration: String,
    category: String,
    price: Number,
    website: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Workshop ||
  mongoose.model("Workshop", WorkshopSchema);
