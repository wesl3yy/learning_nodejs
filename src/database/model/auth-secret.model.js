import mongoose from "mongoose";

const token = mongoose.Schema({
  token: {
      type: String,
      unique: true,
  },
  user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userAccount",
  },
  created_at: {
      type: Date,
      default: Date.now
  },
  updated_at: {
      type: Date,
      default: Date.now
  },
});

export const UserSecret = mongoose.model("auth_secret", token);