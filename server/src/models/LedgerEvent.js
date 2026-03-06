import mongoose from "mongoose";

const ledgerEventSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    fileId: {
      type: String,
      required: true,
      index: true
    },
    originalName: {
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
      minlength: 16,
      maxlength: 16
    },
    integrityHash: {
      type: String,
      required: true,
      minlength: 64,
      maxlength: 64
    },
    eventType: {
      type: String,
      enum: ["minted", "claimed", "deleted"],
      required: true
    },
    blockHeight: {
      type: Number,
      required: true
    },
    previousHash: {
      type: String,
      required: true
    },
    blockHash: {
      type: String,
      required: true,
      unique: true
    },
    transactionHash: {
      type: String,
      required: true,
      unique: true
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

ledgerEventSchema.index({ user: 1, blockHeight: -1 });

const LedgerEvent = mongoose.model("LedgerEvent", ledgerEventSchema);

export default LedgerEvent;
