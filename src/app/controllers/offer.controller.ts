import { Request, Response, Router } from "express";
import Offers from "../models/offer.model";
import Property from "../models/propertyDetails.model";
import purchasedProperties from "../models/purchasedProperty.model";
import { sendEmail } from "../utils/sendMail.util";
// import userRouter from "./user.controller";
import User from "../models/user.model";
import PurchasedProperty from "../interfaces/purchasedProperty.interface";
import mongoose from "mongoose";

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
                    status: "sold",
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

interface NewPropertyOwnerName {
    _id: mongoose.Types.ObjectId,
    username: string,
    email: string,
    password: string,
    NDAStatus: string,
    role: string,
    lastLoggedIn: Date,
    status: string,
    createdAt: Date,
    updateAt: Date,
    __v: number
}

offerRouter.post("/buy-property", async (req: Request, res: Response) => {
    try {
        const boughtPropertyInfo = req.body;
        const newPropertyOwnerName = await User.findOne({
            customerEmail: boughtPropertyInfo?.customerEmail
        }) as NewPropertyOwnerName | null;
        console.log(newPropertyOwnerName)
        const result = await purchasedProperties.insertOne<PurchasedProperty>({ ...boughtPropertyInfo, customerUsername: newPropertyOwnerName?.username });

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

        console.log(newOwnerInformation)

        const order = await purchasedProperties.findById(purchaseID);

        const orderedProperty = await Property.findOne({ _id: order?.propertyID });

        // console.log(orderedProperty)

        const updatedDOC = {
            $set: {
                status: "sold",
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

        await sendEmail({
            to: newOwnerInformation.email || "support@clearquity.com",
            subject: `The owner of ${orderedProperty?.propertyName} agreed to sell the propertyt to you!`,
            html: `<div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 20px;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 30px; border: 1px solid #e5e5e5;">
      
      <h2 style="color: #0a2540; text-align: center; margin-bottom: 20px;">
          🎉 Congratulations on Your Successful Property Purchase!
      </h2>

      <p style="font-size: 15px; color: #333;">
          Hi <strong>{{buyerName}}</strong>,
      </p>

      <p style="font-size: 15px; color: #333; line-height: 1.6;">
          We’re excited to inform you that the owner of 
          <strong>{{propertyName}}</strong> has officially agreed to sell the property to you!
      </p>

      <p style="font-size: 15px; color: #333; line-height: 1.6;">
          The property status has now been updated to <strong>Sold</strong>, and our team will guide you through the next steps shortly.  
      </p>

      <div style="background: #f0f7ff; border-left: 4px solid #0066ff; padding: 12px 16px; margin: 20px 0; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; color: #0a2540;">
              <strong>New Owner Information:</strong><br>
              Name: {{buyerName}}<br>
              Email: {{buyerEmail}}<br>
              Phone: {{buyerPhone}}
          </p>
      </div>

      <p style="font-size: 15px; color: #333; line-height: 1.6;">
          If you have any questions or need assistance, feel free to reach out to us anytime.  
          We’re here to help you every step of the way.
      </p>

      <p style="font-size: 15px; color: #333; margin-top: 25px;">
          Warm regards,<br>
          <strong>The ClearQuity Team</strong><br>
          <span style="font-size: 13px; color: #555;">support@clearquity.com</span>
      </p>

  </div>
</div>
`
        })

        res.json({
            success: true,
            message: "Successfully Sold!",
            sellingResult
        })
    } catch (err) {
        res.json({
            success: false,
            message: "Something went wrong!",
            error: err
        })
    }
})

offerRouter.get("/all-purchases", async (req: Request, res: Response) => {
    try {
        const allPurchases = await purchasedProperties.find();

        res.json({
            success: true,
            message: "Purchases all are fetched!",
            allPurchases
        })
    } catch (err) {
        res.json({
            success: false,
            message: "Something went wrong!",
            error: err
        })
    }
})