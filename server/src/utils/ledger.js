import crypto from "node:crypto";
import LedgerEvent from "../models/LedgerEvent.js";

const hashValue = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

export const recordLedgerEvent = async ({
  userId,
  file,
  eventType,
  details = {},
  occurredAt = new Date()
}) => {
  const previousEvent = await LedgerEvent.findOne({ user: userId }).sort({
    blockHeight: -1
  });
  const previousHash = previousEvent?.blockHash ?? "GENESIS";
  const blockHeight = previousEvent ? previousEvent.blockHeight + 1 : 1;
  const fileId = String(file._id ?? file.id ?? "");
  const transactionHash = hashValue(
    JSON.stringify({
      seed: crypto.randomUUID(),
      userId: String(userId),
      fileId,
      eventType,
      occurredAt: occurredAt.toISOString()
    })
  );
  const blockHash = hashValue(
    JSON.stringify({
      previousHash,
      transactionHash,
      blockHeight,
      eventType,
      fileId,
      integrityHash: file.integrityHash ?? "",
      accessCode: file.accessCode ?? "",
      occurredAt: occurredAt.toISOString(),
      details
    })
  );

  return LedgerEvent.create({
    user: userId,
    fileId,
    originalName: file.originalName,
    mimeType: file.mimeType,
    size: file.size,
    accessCode: file.accessCode,
    integrityHash: file.integrityHash,
    eventType,
    blockHeight,
    previousHash,
    blockHash,
    transactionHash,
    details
  });
};
