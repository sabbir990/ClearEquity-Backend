import { Request, Response, Router } from "express";
import Offers from "../models/offer.model";
import Property from "../models/propertyDetails.model";
import purchasedProperties from "../models/purchasedProperty.model";
import { sendEmail } from "../utils/sendMail.util";
// import userRouter from "./user.controller";
import User from "../models/user.model";
import PurchasedProperty from "../interfaces/purchasedProperty.interface";
import mongoose from "mongoose";
import Counter_Offer from "../models/counterOffer.model";
import { ObjectId } from "mongodb";

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
        const user = await User.findOne({ email: offer?.buyerEmail })
        const property = await Property.findOne({ _id: new ObjectId(offer?.propertyID) })

        const offerObject = {
            ...offer, buyerName: user?.username, propertyAddress: property?.propertyAddress
        }

        const result = await Offers.insertOne(offerObject);

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

offerRouter.delete('/delete-offer/:offerID', async (req: Request, res: Response) => {
    try {
        const offerID = req.params.offerID;

        const result = await Offers.findByIdAndDelete(offerID);



        res.status(201).json({
            success: true,
            message: "Deleted offer!",
            result
        })
    } catch (err) {
        res.status(403).json({
            success: false,
            message: "Something went wrong!",
            error: err
        })
    }
})

offerRouter.post('/counter-offer', async (req: Request, res: Response) => {
    try {
        const counterOfferObject = req.body;
        const offerID = counterOfferObject.offerID;
        const offer = await Offers.findById(offerID);
        const counterOffer = {
            offerID,
            propertyID: offer?.propertyID,
            offeredPrice: offer?.offeredPrice,
            propertyCurrentPrice: offer?.propertyCurrentPrice,
            buyerEmail: offer?.buyerEmail,
            counterdPrice: counterOfferObject?.counterPrice,
            propertyOwnerEmail: offer?.propertyOwnerEmail,
        }

        const counterOfferSavingResponse = await Counter_Offer.insertOne(counterOffer);

        const updatedDoc = {
            $set: {
                status: "countered"
            }
        }

        await Offers.findByIdAndUpdate(offerID, updatedDoc);

        await sendEmail({
            to: offer?.buyerEmail!,
            subject: "Yayyyy! The owner has has submitted their expected price based on your offer!",
            html: `
            <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
                .header { background-color: #007bff; color: white; padding: 25px; text-align: center; }
                .header h1 { margin: 0; font-size: 24px; }
                .content { padding: 30px; background-color: #ffffff; }
                .greeting { font-size: 18px; font-weight: bold; color: #007bff; margin-bottom: 10px; }
                .info-box { background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0; border-left: 4px solid #007bff; }
                .data-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px inset #eee; }
                .data-label { color: #666; font-weight: 600; }
                .data-value { color: #222; font-weight: bold; }
                .price-highlight { font-size: 20px; color: #28a745; margin-top: 10px; text-align: center; }
                .footer { padding: 20px; text-align: left; font-size: 14px; color: #777; background-color: #ffffff; }
                .heart { color: #007bff; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>ClearQuity Counter-Offer</h1>
                </div>
                <div class="content">
                    <p class="greeting">Great news!</p>
                    <p>The property owner has reviewed your offer for <strong>Property ID: ${offer?.propertyID}</strong> and has submitted a counter-price for your consideration.</p>
                    
                    <div class="info-box">
                        <div class="data-row">
                            <span class="data-label">Listing Price:</span>
                            <span class="data-value">$${offer?.propertyCurrentPrice}</span>
                        </div>
                        <div class="data-row">
                            <span class="data-label">Your Initial Offer:</span>
                            <span class="data-value">$${offer?.offeredPrice}</span>
                        </div>
                        <div style="margin-top: 15px; border-top: 2px solid #007bff; padding-top: 10px;">
                            <div class="data-label" style="text-align: center;">Owner's Expected Price:</div>
                            <div class="price-highlight">$${counterOfferObject?.counterPrice}</div>
                        </div>
                    </div>

                    <p>Log in to your dashboard to accept the counter-offer or negotiate further.</p>
                </div>
                <div class="footer">
                    Best regards,<br>
                    <strong>The ClearQuity Team <span class="heart">💙</span></strong>
                </div>
            </div>
        </body>
        </html> 
            `
        })

        await sendEmail({
            to: offer?.propertyOwnerEmail!,
            subject: "Your countered price is announced to buyer safe and sound!",
            html: `
                 <!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
        .header { background-color: #007bff; color: white; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; background-color: #ffffff; }
        .status-badge { display: inline-block; background-color: #e7f3ff; color: #007bff; padding: 5px 15px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-bottom: 15px; }
        .greeting { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .info-box { background-color: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0; border-left: 4px solid #28a745; }
        .data-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
        .data-label { color: #666; font-weight: 600; }
        .data-value { color: #222; font-weight: bold; }
        .price-highlight { font-size: 22px; color: #007bff; margin-top: 10px; text-align: center; font-weight: bold; }
        .next-steps { margin-top: 25px; padding-top: 20px; border-top: 1px solid #eee; }
        .footer { padding: 20px; text-align: left; font-size: 14px; color: #777; background-color: #ffffff; }
        .heart { color: #007bff; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Counter-Offer Confirmed</h1>
        </div>
        <div class="content">
            <div class="status-badge">Action Successful</div>
            <p class="greeting">Hello!</p>
            <p>Your counter-offer for <strong>Property ID: ${offer?.propertyID}</strong> has been successfully delivered to the buyer (${offer?.buyerEmail}).</p>
            <div class="info-box">
                <div class="data-row">
                    <span class="data-label">Original Listing:</span>
                    <span class="data-value">$${offer?.propertyCurrentPrice}</span>
                </div>
                <div class="data-row">
                    <span class="data-label">Buyer's Offer:</span>
                    <span class="data-value">$${offer?.offeredPrice}</span>
                </div>
                <div style="margin-top: 15px;">
                    <div class="data-label" style="text-align: center;">Your New Countered Price:</div>
                    <div class="price-highlight">$${counterOfferObject?.counterPrice}</div>
                </div>
            </div>

            <div class="next-steps">
                <strong>What happens next?</strong>
                <p>We have notified the buyer via email. They can now choose to:</p>
                <ul style="padding-left: 20px; color: #555;">
                    <li>Accept your counter-offer.</li>
                    <li>Submit a new offer for your review.</li>
                </ul>
                <p>You will be notified immediately of their decision.</p>
            </div>
        </div>
        <div class="footer">
            Best regards,<br>
            <strong>The ClearQuity Team <span class="heart">💙</span></strong>
        </div>
    </div>
</body>
</html>
            `
        })

        res.json({
            success: true,
            message: "Counter Offer is sent!",
            result: counterOfferSavingResponse
        })

    } catch (err) {
        res.json({
            success: false,
            message: "Something went wrong!",
            error: err
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
            email: boughtPropertyInfo?.customerEmail
        }) as NewPropertyOwnerName | null;

   
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


        const order = await purchasedProperties.findById(purchaseID);

        const orderedProperty = await Property.findOne({ _id: order?.propertyID });

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
          Hi <strong>${newOwnerInformation?.name}</strong>,
      </p>

      <p style="font-size: 15px; color: #333; line-height: 1.6;">
          We’re excited to inform you that the owner of 
          <strong>${orderedProperty?.propertyName}</strong> has officially agreed to sell the property to you!
      </p>

      <p style="font-size: 15px; color: #333; line-height: 1.6;">
          The property status has now been updated to <strong>Sold</strong>, and our team will guide you through the next steps shortly.  
      </p>

      <div style="background: #f0f7ff; border-left: 4px solid #0066ff; padding: 12px 16px; margin: 20px 0; border-radius: 6px;">
          <p style="margin: 0; font-size: 14px; color: #0a2540;">
              <strong>New Owner Information:</strong><br>
              Name: ${newOwnerInformation?.name}<br>
              Email: ${newOwnerInformation?.email}<br>
              Phone: ${newOwnerInformation?.phone}
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

offerRouter.patch("/reject-order/:orderId", async (req: Request, res: Response) => {
    try {
        const orderId = req.params.orderId;
        const order = await purchasedProperties.findById(orderId);
        const property = await Property.findOne({ _id: new ObjectId(order?.propertyID) });
        const filter = { _id: new ObjectId(orderId) };
        const updatedDOC = {
            $set: {
                status: "rejected"
            }
        }

        const result = await purchasedProperties.updateOne(filter, updatedDOC);

        if (!order || !order?.customerEmail) {
            return {
                success: false,
                message: "Customer Email is not found!",
            }
        }

        await sendEmail({
            to: order.customerEmail,
            subject: `The owner of the property ${property?.propertyName} has declined your purchasing proposal!`,
            html: `
<div style="background-color: #f3f4f6; padding: 40px 10px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        
        <div style="height: 6px; background-color: #126BA3;"></div>

        <div style="padding: 32px 32px 10px 32px; text-align: center;">
            <div style="font-size: 26px; font-weight: 800; color: #126BA3; letter-spacing: -1px; margin-bottom: 5px;">
                ClearEquity<span style="color: #10b981;">.</span>
            </div>
            <div style="width: 40px; height: 1px; background-color: #e5e7eb; margin: 20px auto;"></div>
        </div>

        <div style="padding: 0 40px 40px 40px;">
            <h2 style="color: #111827; font-size: 20px; font-weight: 700; text-align: center; margin-bottom: 24px;">
                Update on your proposal
            </h2>
            
            <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                Hello, <br><br>
                Thank you for your interest in <strong>${property?.propertyName}</strong>. We appreciate the competitive offer you submitted through ClearEquity.
            </p>

            <div style="text-align: center; margin: 32px 0;">
                <div style="display: inline-block; background-color: #fff1f2; border: 1px solid #ffe4e6; padding: 12px 24px; border-radius: 50px;">
                    <span style="color: #e11d48; font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">
                        ● Proposal Declined
                    </span>
                </div>
            </div>

            <p style="color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 32px; text-align: center;">
                The property owner has reviewed all submissions and decided to move forward with another proposal. This decision is final but does not reflect on your eligibility for future listings.
            </p>

            <div style="text-align: center;">
                <a href="https://clear-equity.vercel.app/listings" 
                   style="background-color: #111827; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 600; font-size: 15px; display: inline-block; transition: background-color 0.3s ease;">
                   Explore Available Listings
                </a>
            </div>

            <div style="margin-top: 40px; padding-top: 24px; border-top: 1px solid #f3f4f6; text-align: center;">
                <p style="color: #9ca3af; font-size: 13px;">
                    Questions? Reply to this email or visit our Help Center.
                </p>
            </div>
        </div>

        <div style="background-color: #fafafa; padding: 24px; text-align: center;">
            <p style="font-size: 12px; color: #9ca3af; margin: 0; text-transform: uppercase; letter-spacing: 1px;">
                &copy; ${new Date().getFullYear()} ClearEquity Inc.
            </p>
            <div style="margin-top: 10px;">
                <a href="#" style="color: #9ca3af; text-decoration: underline; font-size: 11px;">Unsubscribe</a>
            </div>
        </div>
    </div>
</div>
`
        })

        res.json({
            success: true,
            message: "Successfully Rejected!",
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