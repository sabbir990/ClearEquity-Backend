import nodemailer from "nodemailer";
import EmailRequirements from "../interfaces/emailRequirements.interface";

export const sendEmail = async ({to, subject, html} : EmailRequirements)  => {
    const transporter = nodemailer.createTransport({
        service : "gmail",
        auth : {
            user : process.env.EMAIL_USER,
            pass : process.env.EMAIL_PASS
        }
    })

    await transporter.sendMail({
        from : `"ClearQuity" ${process.env.EMAIL_USER}`,
        to,
        subject,
        html
    })
}