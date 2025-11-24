import { Request, Response, Router } from "express";
import Offers from "../models/offer.model";
import Property from "../models/propertyDetails.model";
import purchasedProperties from "../models/purchasedProperty.model";

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
    try {
        const propertyNewOwner = req.body;
        const offerID = req.params.offerID;
        const filteredOffer = await Offers.findById(offerID);

        if (filteredOffer) {
            const filteredProperty = await Property.findById(filteredOffer?.propertyID);

            const updatedDOC = {
                $set: {
                    status: "rented",
                    propertyOwner: {
                        name: propertyNewOwner.name,
                        designation: propertyNewOwner.designation,
                        email: propertyNewOwner.email,
                        phone: propertyNewOwner.phone
                    }
                }
            }

            await Offers.findByIdAndUpdate(offerID, { $set: { status: "accepted" } });

            const updatedResult = await Property.findByIdAndUpdate(filteredProperty?._id, updatedDOC);

            res.send({
                success: true,
                message: "Offer accepted successfully!",
                updatedResult
            })
        }
    } catch (err) {
        res.send({
            success: false,
            message: "Something went wrong!",
            error: err
        })
    }
})

offerRouter.patch("/reject-offer/:offerID", async (req: Request, res: Response) => {
    try {
        const offerID = req.params.offerID;

        const rejectedResult = await Offers.findByIdAndUpdate(offerID, { $set: { status: "rejected" } });

        res.json({
            success: true,
            message: "Rejected successfully!",
            rejectedResult
        })
    } catch (err) {
        res.json({
            success: false,
            message: "Something went wrong!",
            error: err
        })
    }
})

offerRouter.post("/buy-property", async (req: Request, res: Response) => {
    try {
        const boughtPropertyInfo = req.body;
        const result = await purchasedProperties.insertOne(boughtPropertyInfo);

        res.json({
            success: true,
            message: "Ordered Successfully",
            result
        })
    } catch (err) {
        res.json({
            success: false,
            message: "Something went wrong!",
            error: err
        })
    }
})

offerRouter.patch("/sell-property/:purchaseID", async (req: Request, res: Response) => {
    try {
        const purchaseID = req.params.purchaseID;
        const newOwnerInformation = req.body;

        const order = await purchasedProperties.findById(purchaseID);

        const orderedProperty = await Property.findOne({ _id: order?.propertyID });

        // console.log(orderedProperty)

        const updatedDOC = {
            $set: {
                status: "rented",
                propertyOwner: {
                    name: newOwnerInformation.name,
                    designation: newOwnerInformation.designation,
                    email: newOwnerInformation.email,
                    phone: newOwnerInformation.phone
                }
            }
        }

        await purchasedProperties.findByIdAndUpdate(purchaseID, { $set: { status: "sold" } });
        const sellingResult = await Property.findByIdAndUpdate(orderedProperty?._id, updatedDOC);

        res.json({
            success: true,
            message: "Successfully Sold!",
            sellingResult
        })
    } catch (err) {
        res.json({
            success: false,
            message: "Something went wrong!",
            error : err
        })
    }
})