import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String, default: "" },
  points: { type: Number, default: 0 },
  panels: [
    {
      name: String,
      plan: String,
      memoryMB: Number,
      external_id: String,
      createdAt: { type: Date, default: Date.now },
      locked: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);