import express, { Request, Response } from "express";
import cloudinary from "../utils/cloudinarySetup";
import multer from "multer";

export const cloudinaryRouter = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

cloudinaryRouter.get("/", async (req: Request, res: Response) => {
    res.send("This is cloudinary route for the server!")
})

cloudinaryRouter.post("/upload", upload.single("file"), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.json({
                message: "File not found!"
            })
        }

        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({
                folder: "my_files",
                resource_type: "auto"
            },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                }
            )

            stream.end(req.file?.buffer);

        })

        res.json({
            uploadResult
        })
    } catch (err) {
        res.status(500).json({ message: "Error uploading file!" })
    }
})

