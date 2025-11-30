import express, { Request, Response } from "express";
import cloudinary from "../utils/cloudinarySetup";
import multer from "multer";

export const cloudinaryRouter = express.Router();
const upload = multer({dest: "uploads/"});

cloudinaryRouter.post("/upload", upload.single("file"), async(req: Request, res: Response) => {
    try{
        if(!req.file){
            return res.json({
                message: "File not found!"
            })
        }
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            resource_type: "auto",
            folder: "my_files"
        })

        res.json({
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
            type: uploadResult.resource_type
        })
    }catch(err){
        res.status(500).json({message: "Error uploading file!"})
    }
})

