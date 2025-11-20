import express, { Request, Response } from "express";
import Property from "../models/propertyDetails.model";
import OwnerAutomatomations from "../models/ownerAutomation.model";
import { sendEmail } from "../utils/sendMail.util";
import qs from "qs";
import propertyOffer from "../models/propertyOffer.model";

export const propertyOperationRouter = express.Router();

propertyOperationRouter.get("/", async (req: Request, res: Response) => {
  try {
    const queryString = req.originalUrl.split("?")[1] || "";

    const queryObj = qs.parse(queryString);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|lte|gt|lt)\b/g, match => `$${match}`);

    const filter = JSON.parse(queryStr);

    const result = await Property.find(filter);

    res.status(200).json({
      success: true,
      message: "Properties retrieved successfully!",
      properties: result,
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
});

propertyOperationRouter.post("/add-property", async (req: Request, res: Response) => {
  const propertyDetailsObject = req.body;

  if (!propertyDetailsObject.propertyOwner.email) {
    return res.status(500).json({
      success: false,
      message: "Make sure add the property as a registered user!"
    })
  }

  const result = await Property.insertOne(propertyDetailsObject);

  res.status(201).json({
    success: true,
    message: "Property added successfully!",
    property: result
  })
})

propertyOperationRouter.post("/contact-owner/:propertyID", async (req: Request, res: Response) => {
  const propertyID = req.params.propertyID;
  const { propertyStatus, name, email, phone, message } = req.body;

  if (!propertyID || !name || !email || !message) {
    return res.json({
      success: false,
      message: "Name, Email and Message field is required!"
    })
  }

  const propertyDetails = await Property.findById(propertyID);

  const ownerEmail = propertyDetails?.propertyOwner?.email;

  const automationObjectForSave = {
    ownerEmail,
    senderEmail: email,
    propertyID: propertyID,
    propertyStatus: propertyStatus,
    automation: {
      name,
      email,
      phone,
      message
    }
  }

  await OwnerAutomatomations.insertOne(automationObjectForSave);

  await sendEmail({
    to: ownerEmail || "support@clearquity.com",
    subject: "Wanted to reach out regarding the property!",
    html: `
            <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Property Inquiry</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" style="width:100%; border-collapse:collapse; background-color:#f4f6f8;">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table role="presentation" style="width:90%; max-width:650px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(90deg,#007bff,#00bcd4); padding:24px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:22px;">📩 New Inquiry About Your Property</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <p style="font-size:16px; color:#333; margin-bottom:24px;">
                  Hello <strong>${propertyDetails?.propertyOwner.name}</strong>,<br><br>
                  You’ve received a new inquiry regarding your property. Here are the details of the person interested:
                </p>

                <table role="presentation" style="width:100%; border-collapse:collapse; background-color:#f9fafb; border-radius:8px; overflow:hidden;">
                  <tr>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb; width:35%; font-weight:600; color:#007bff;">Name:</td>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb; font-weight:600; color:#007bff;">Email:</td>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb; font-weight:600; color:#007bff;">Phone:</td>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb;">${phone}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; font-weight:600; color:#007bff; vertical-align:top;">Message:</td>
                    <td style="padding:12px 16px; color:#333333; white-space:pre-line;">${message}</td>
                  </tr>
                </table>

                <div style="margin-top:28px; text-align:center;">
                  <a href="mailto:${email}" style="background-color:#007bff; color:#ffffff; padding:12px 24px; border-radius:6px; text-decoration:none; display:inline-block; font-weight:500;">
                    Reply to ${name}
                  </a>
                </div>

                <p style="font-size:13px; color:#666; margin-top:24px;">
                  This message was automatically generated from the ClearQuity Contact Form. Please respond promptly to inquiries to engage potential clients.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f1f5f9; padding:16px; text-align:center; font-size:12px; color:#666;">
                © ${new Date().getFullYear()} ClearQuity. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
        `
  })

  await sendEmail({
    to: email || "support@clearquity.com",
    subject: "The owner has recieved your email. He/she'll be contacting you soon!",
    html: `
        <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Message Received | ClearQuity</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" style="width:100%; border-collapse:collapse; background-color:#f4f6f8;">
      <tr>
        <td align="center" style="padding:40px 0;">
          <table role="presentation" style="width:90%; max-width:650px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08);">

            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(90deg,#007bff,#00bcd4); padding:24px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:22px;">✅ Your Message Has Been Sent!</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <p style="font-size:16px; color:#333; margin-bottom:24px;">
                  Hello <strong>${name || "there"}</strong>,
                </p>

                <p style="font-size:16px; color:#333; line-height:1.6; margin-bottom:24px;">
                  We’ve successfully delivered your message to the property owner. They will be contacting you shortly regarding your inquiry. Thank you for reaching out via <strong>ClearQuity</strong>.
                </p>

                <table role="presentation" style="width:100%; border-collapse:collapse; background-color:#f9fafb; border-radius:8px; overflow:hidden; margin-bottom:24px;">
                  <tr>
                    <td style="padding:12px 16px; font-weight:600; color:#007bff; width:35%;">Your Name:</td>
                    <td style="padding:12px 16px;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; font-weight:600; color:#007bff;">Email:</td>
                    <td style="padding:12px 16px;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; font-weight:600; color:#007bff;">Phone:</td>
                    <td style="padding:12px 16px;">${phone || "Not Provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; font-weight:600; color:#007bff; vertical-align:top;">Message:</td>
                    <td style="padding:12px 16px; white-space:pre-line;">${message}</td>
                  </tr>
                </table>

                <p style="font-size:16px; color:#333; line-height:1.6; margin-bottom:24px;">
                  Meanwhile, you can visit our website to browse more properties or follow up on your inquiry.
                </p>

                <div style="text-align:center; margin-bottom:24px;">
                  <a href="https://clearquity.com" style="background-color:#007bff; color:#ffffff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:500; display:inline-block;">
                    Visit ClearQuity
                  </a>
                </div>

                <p style="font-size:13px; color:#666;">
                  This is an automated confirmation email. Please do not reply to this email directly.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f1f5f9; padding:16px; text-align:center; font-size:12px; color:#666;">
                © ${new Date().getFullYear()} ClearQuity. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
        `
  })

  res.json({
    success: true,
    message: "Automation has been sent to both user and sender!",
  })
})

propertyOperationRouter.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;
  const result = await Property.findById(id);

  const updatedDoc = {
    $inc: {
      views: 1
    }
  }

  await Property.findByIdAndUpdate(id, updatedDoc);

  res.status(201).send({
    success: true,
    message: "Property found!",
    property: result
  })
})

propertyOperationRouter.patch("/sell-property/:id", async (req: Request, res: Response) => {

})

propertyOperationRouter.patch("/approve-property/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const updatedDoc = {
      $set: {
        propertyAccepted: true
      }
    }

    const result = await Property.findByIdAndUpdate(id, updatedDoc);

    res.status(200).json({
      success: true,
      message: "Property is successfully accepted!",
      result
    })
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Something went wrong!",
      error: err,
    });
  }
})

propertyOperationRouter.post("/send-offer/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { email } = req.body;
    const selectedProperty = await Property.findById(id);
    const offerObj = {
      ...selectedProperty?.toObject(), offeredTo: email
    }

    const result = await propertyOffer.insertOne(offerObj);

    res.json({
      success: true,
      message: "Offer has been sent successfully!",
      result
    })
  } catch (err) {
    res.json({
      success: false,
      message: "Something went wrong!",
      error: err
    })

    console.log(err)
  }
})

propertyOperationRouter.get("/get-all-contacts/:senderEmail", async (req: Request, res: Response) => {
  try {
    const senderEmail = req.params.senderEmail;
    const filter = { senderEmail: senderEmail };
    const result = await OwnerAutomatomations.find(filter);
    res.json({
      success: true,
      message: "All contacts fetched!",
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

propertyOperationRouter.delete("/remove-owner-conversation/:conversationID", async (req: Request, res: Response) => {
  try {
    const conversationID = req.params.conversationID;
    const result = await OwnerAutomatomations.findByIdAndDelete(conversationID);
    res.json({
      success: true,
      message: "Conversation deleted successfully and now it'll be deleted from shortlisted too.",
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