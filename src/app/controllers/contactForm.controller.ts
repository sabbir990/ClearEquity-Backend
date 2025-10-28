import ContactInfo from "../models/contactForm.model";
import express, { Request, Response } from "express";
import { sendEmail } from "../utils/sendMail.util";

export const contactRouter = express.Router();

contactRouter.get("/", async (req: Request, res: Response) => {
    res.send("Welcome to contact API! It's currently in progress!")
});

contactRouter.post("/send-message", async (req: Request, res: Response) => {
    const { firstName, lastName, email, phone, subject, message } = req.body;

    if (!email) {
        res.json({
            success: true,
            message: "Make sure to enter your email! It's required!"
        })
    }

    const result = await ContactInfo.insertOne({
        firstName, lastName, email, phone, subject, message
    })

    if (!result) {
        res.status(500).json({
            success: false,
            message: "Something went wrong while saving the data!"
        })
    }

    await sendEmail({
        to: process.env.EMAIL_USER || "support@clearquity.com",
        subject: subject,
        html: `
            <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Contact Form Submission</title>
  </head>
  <body style="margin:0; padding:0; background-color:#f4f6f8; font-family:'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table role="presentation" style="width:100%; border-collapse:collapse; background-color:#f4f6f8;">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <table role="presentation" style="width:90%; max-width:650px; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 4px 15px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(90deg,#007bff,#00bcd4); padding:24px; text-align:center;">
                <h1 style="color:#ffffff; margin:0; font-size:22px;">📩 New Contact Form Submission</h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <p style="font-size:16px; color:#333; margin-bottom:24px;">
                  Hello <strong>Admin</strong>,<br><br>
                  You’ve received a new message from the <strong>ClearQuity Contact Form</strong>. Here are the details:
                </p>

                <table role="presentation" style="width:100%; border-collapse:collapse; background-color:#f9fafb; border-radius:8px; overflow:hidden;">
                  <tr>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb; width:35%; font-weight:600; color:#007bff;">First Name:</td>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb;">${firstName}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb; font-weight:600; color:#007bff;">Last Name:</td>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb;">${lastName}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb; font-weight:600; color:#007bff;">Email:</td>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb; font-weight:600; color:#007bff;">Phone:</td>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb;">${phone || "Not Provided"}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb; font-weight:600; color:#007bff;">Subject:</td>
                    <td style="padding:12px 16px; border-bottom:1px solid #e5e7eb;">${subject}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px; font-weight:600; color:#007bff; vertical-align:top;">Message:</td>
                    <td style="padding:12px 16px; color:#333333; white-space:pre-line;">${message}</td>
                  </tr>
                </table>

                <div style="margin-top:28px; text-align:center;">
                  <a href="mailto:${email}" style="background-color:#007bff; color:#ffffff; padding:12px 24px; border-radius:6px; text-decoration:none; display:inline-block; font-weight:500;">
                    Reply to ${firstName}
                  </a>
                </div>

                <p style="font-size:13px; color:#666; margin-top:24px;">
                  This message was automatically generated from the ClearQuity Contact Form.
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
        to: email,
        subject: "Greetings for reaching out to us!",
        html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>We’ve Received Your Message | ClearQuity</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6fa;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
    }
    .email-container {
      width: 100%;
      background-color: #f4f6fa;
      padding: 40px 0;
    }
    .email-box {
      max-width: 650px;
      background-color: #ffffff;
      margin: 0 auto;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
    }
    .header {
      background: linear-gradient(90deg, #007bff, #00bcd4);
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 26px;
      letter-spacing: 0.5px;
    }
    .content {
      padding: 40px 35px;
      text-align: left;
    }
    .content h2 {
      color: #007bff;
      font-size: 20px;
      margin-bottom: 12px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.7;
      color: #444;
      margin: 12px 0;
    }
    .highlight-box {
      background-color: #f0f8ff;
      border-left: 4px solid #007bff;
      padding: 15px 20px;
      border-radius: 8px;
      margin: 25px 0;
      color: #555;
    }
    .button {
      display: inline-block;
      background-color: #007bff;
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 30px;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
      text-align: center;
    }
    .divider {
      border-top: 1px solid #e5e9f2;
      margin: 30px 0;
    }
    .footer {
      background-color: #f8fafc;
      text-align: center;
      padding: 20px;
      font-size: 13px;
      color: #777;
    }
    .social-links a {
      color: #007bff;
      text-decoration: none;
      margin: 0 8px;
      font-weight: 600;
    }
  </style>
</head>

<body>
  <div class="email-container">
    <div class="email-box">
      <!-- Header -->
      <div class="header">
        <h1>Thank You for Getting in Touch!</h1>
      </div>

      <!-- Content -->
      <div class="content">
        <p>Hi <strong>${firstName || "there"}</strong>,</p>

        <p>We’ve received your message and wanted to let you know that your inquiry is in good hands. One of our team members will get back to you as soon as possible — usually within 24–48 hours.</p>

        <div class="highlight-box">
          <p><strong>Your submission details:</strong></p>
          <p><strong>Name:</strong> ${firstName || "N/A"} ${lastName || ""}</p>
          <p><strong>Email:</strong> ${email || "N/A"}</p>
          <p><strong>Message:</strong> ${message || "No message provided."}</p>
        </div>

        <h2>What Happens Next?</h2>
        <p>Our support or business team will review your message carefully. If your inquiry requires detailed information, you may receive a follow-up email from one of our representatives.</p>

        <p>In the meantime, feel free to explore our website for more about what we do and how we can help you achieve your goals.</p>

        <div style="text-align:center;">
          <a href="https://clearquity.com" class="button">Visit ClearQuity</a>
        </div>

        <div class="divider"></div>

        <h2>Stay Connected</h2>
        <p>We’d love for you to join our growing community. Follow us to get the latest updates, tips, and insights from ClearQuity.</p>

        <div class="social-links" style="text-align:center;">
          <a href="https://facebook.com/clearquity">Facebook</a> |
          <a href="https://twitter.com/clearquity">Twitter</a> |
          <a href="https://linkedin.com/company/clearquity">LinkedIn</a> |
          <a href="https://instagram.com/clearquity">Instagram</a>
        </div>

        <div class="divider"></div>

        <p style="font-size:15px; text-align:center;">We appreciate your trust in <strong>ClearQuity</strong>. Expect a detailed response soon!</p>

        <p style="font-size:14px; color:#666; text-align:center;">Warm regards,<br><strong>The ClearQuity Team</strong></p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>© ${new Date().getFullYear()} ClearQuity. All rights reserved.</p>
        <p>If you didn’t submit this form, please ignore this email.</p>
      </div>
    </div>
  </div>
</body>
</html>

        `
    });

    res.status(201).send({
        success: true,
        message: "Email sent to the user successfully!",
        information: result
    })
})