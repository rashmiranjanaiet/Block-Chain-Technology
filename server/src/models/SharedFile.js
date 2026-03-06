import mongoose from "mongoose";

const sharedFileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    originalName: {
      type: String,
      required: true
    },
    storedName: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      default: "application/octet-stream"
    },
    size: {
      type: Number,
      required: true
    },
    accessCode: {
      type: String,
      required: true,
      unique: true,
      minlength: 16,
      maxlength: 16
    },
    accessCount: {
      type: Number,
      default: 0
    },
    expiresAt: {
      type: Date,
      default: null
    },
    lastAccessedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const SharedFile = mongoose.model("SharedFile", sharedFileSchema);

export default SharedFile;
