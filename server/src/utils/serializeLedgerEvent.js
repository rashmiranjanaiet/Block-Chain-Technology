import { formatAccessCode } from "./accessCode.js";

const eventLabels = {
  minted: "Share anchored",
  claimed: "Receiver claimed",
  deleted: "Owner removed"
};

export const serializeLedgerEvent = (event) => ({
  id: event._id.toString(),
  fileId: event.fileId,
  originalName: event.originalName,
  mimeType: event.mimeType,
  size: event.size,
  accessCode: event.accessCode,
  formattedAccessCode: formatAccessCode(event.accessCode),
  integrityHash: event.integrityHash,
  eventType: event.eventType,
  eventLabel: eventLabels[event.eventType] ?? event.eventType,
  blockHeight: event.blockHeight,
  previousHash: event.previousHash,
  blockHash: event.blockHash,
  transactionHash: event.transactionHash,
  details: event.details ?? {},
  createdAt: event.createdAt
});
