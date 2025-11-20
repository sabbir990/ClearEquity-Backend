import { Request, Response, Router } from "express";
import mongoose from "mongoose";
import Offers from "../models/offer.model";
import Property from "../models/propertyDetails.model";

export const offerRouter = Router();

offerRouter.get("/", async (req: Request, res: Response) => {
    try {
        const result = await Offers.find();

        res.json({
            success: true,
            message: "Offers retrieving successfully!",
            result
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Something went wrong!",
            error
        })
    }
})

offerRouter.post("/send-an-offer", async (req: Request, res: Response) => {
    try {
        const offer = req.body;
        const result = await Offers.insertOne(offer);

        res.json({
            success: true,
            message: "Offer sending successfully!",
            result
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Something went wrong!",
            error
        })
    }
})

offerRouter.patch("/accept-offer/:offerID", async (req: Request, res: Response) => {
    const offerID = req.params.offerID;
    const filteredOffer = await Offers.findById(offerID);
    // console.log(filteredOffer)
    if (filteredOffer) {
        const filteredProperty = await Property.findById(filteredOffer?.propertyID);

        const updatedDOC = {
            $set : {
                status : "rented"
            }
        }

        const updatedResult = await Property.findByIdAndUpdate(filteredProperty?._id, updatedDOC);

        res.send({
            success: true,
            message : "Offer accepted successfully!",
            updatedResult
        })
    }
})
