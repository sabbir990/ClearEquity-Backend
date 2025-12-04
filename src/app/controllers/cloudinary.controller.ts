import express from "express";
import multer from "multer";
import cloudinary from "../utils/cloudinarySetup";

export const cloudinaryRouter = express.Router();

// IMPORTANT: no other body parsers before this
const upload = multer({ storage: multer.memoryStorage() });

cloudinaryRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      console.log("❌ Multer did NOT receive a file");
      return res.status(400).json({ message: "File missing" });
    }

    // console.log("✅ File received:", req.file);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "my_files", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file!.buffer);
    });

    res.json({ uploadResult });
  } catch (err) {
    console.log("Cloudinary error:", err);
    res.status(500).json({ message: "Upload failed" });
  }
});
