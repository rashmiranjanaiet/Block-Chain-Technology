import fs from "node:fs/promises";
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { upload } from "../middleware/upload.js";
import SharedFile from "../models/SharedFile.js";
import { generateAccessCode } from "../utils/accessCode.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { config } from "../config.js";
import { removeStoredFile } from "../utils/removeStoredFile.js";
import {
  getStoredFilePath,
  sendStoredFile
} from "../utils/sendStoredFile.js";
import { serializeFile } from "../utils/serializeFile.js";

const router = Router();

const createUniqueAccessCode = async () => {
  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = generateAccessCode();
    const existing = await SharedFile.exists({ accessCode: code });

    if (!existing) {
      return code;
    }
  }

  throw new Error("Unable to generate a unique access code. Try again.");
};

router.get(
  "/",
  requireAuth,
  asyncHandler(async (request, response) => {
    const consumedFiles = await SharedFile.find({
      user: request.user._id,
      accessCount: { $gt: 0 }
    });

    if (consumedFiles.length > 0) {
      await SharedFile.deleteMany({
        _id: { $in: consumedFiles.map((file) => file._id) }
      });
      await Promise.all(consumedFiles.map((file) => removeStoredFile(file)));
    }

    const files = await SharedFile.find({ user: request.user._id }).sort({
      createdAt: -1
    });

    response.json({
      files: files.map((file) => serializeFile(file))
    });
  })
);

router.post(
  "/upload",
  requireAuth,
  upload.single("file"),
  asyncHandler(async (request, response) => {
    if (!request.file) {
      response.status(400).json({ message: "Choose a file to upload." });
      return;
    }

    const accessCode = await createUniqueAccessCode();
    const expiresAt =
      config.codeExpiryHours > 0
        ? new Date(Date.now() + config.codeExpiryHours * 60 * 60 * 1000)
        : null;

    const file = await SharedFile.create({
      user: request.user._id,
      originalName: request.file.originalname,
      storedName: request.file.filename,
      mimeType: request.file.mimetype,
      size: request.file.size,
      accessCode,
      expiresAt
    });

    response.status(201).json({
      file: serializeFile(file)
    });
  })
);

router.get(
  "/:id/download",
  requireAuth,
  asyncHandler(async (request, response) => {
    const file = await SharedFile.findOne({
      _id: request.params.id,
      user: request.user._id
    });

    if (!file) {
      response.status(404).json({ message: "File not found." });
      return;
    }

    await fs.access(getStoredFilePath(file));
    sendStoredFile(response, file);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (request, response) => {
    const file = await SharedFile.findOne({
      _id: request.params.id,
      user: request.user._id
    });

    if (!file) {
      response.status(404).json({ message: "File not found." });
      return;
    }

    await SharedFile.deleteOne({ _id: file._id });
    await removeStoredFile(file);

    response.json({ message: "File deleted successfully." });
  })
);

export default router;
