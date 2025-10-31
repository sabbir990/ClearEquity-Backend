import express, { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { ObjectId } from "mongodb";
import OTP from "../models/otp.model";
import nodemailer from "nodemailer";
import UserFeedback from "../models/userFeedback.modal";

const userRouter = express.Router();

userRouter.get("/", async (req: Request, res: Response) => {
    res.send("This is the authentication route. It's currently in progress!")
})

userRouter.get("/users", async (req: Request, res: Response) => {
    try {
        const result = await User.find();

        res.status(201).json({
            success: true,
            message: "All users has been retrived!",
            users: result
        })
    } catch (err) {
        res.status(500).json({
            success: true,
            message: "Something went wrong!",
            error: err
        })
    }
})

userRouter.post("/register", async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ email: email });

        if (userExists) {
            return res.status(400).json({
                message: "User is already registered! Please login insted!"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        if (hashedPassword) {
            const registerableUserObject = {
                username, email, password: hashedPassword, lastLoggedIn: Date.now()
            }

            const result = await User.insertOne(registerableUserObject);

            // Assign token with user's email
            const token = jwt.sign({ id: result._id, email }, process.env.JWT_SECRET!, { expiresIn: "1d" });

            // Save cookies
            // res.cookie('token', token, {
            //     httpOnly: true,
            //     secure: process.env.NODE_ENV === "production",
            //     sameSite: "lax"
            // })

            res.status(201).json({
                success: true,
                message: "User created successfully!",
                user: result,
                token
            })
        }

    } catch (err) {
        res.json({
            success: false,
            message: "Something went wrong!",
            Error: err
        })
    }
});

userRouter.get('/check', async (req: Request, res: Response) => {
    const token = req.cookies.token;

    if (!token) {
        return res.json({
            loggedIn: false
        })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        return res.json({
            loggedIn: false
        })
    }

    res.json({
        loggedIn: true,
        user
    })

})

userRouter.post("/login", async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email: email });

    if (!userExists) {
        return res.status(400).json({
            success: false,
            message: "User isn't registered yet! Please register first!"
        })
    }

    const userId = new ObjectId(userExists._id)

    const compairPassword = await bcrypt.compareSync(password, userExists.password);

    if (compairPassword) {
        const token = jwt.sign({ id: userId, email: userExists.email }, process.env.JWT_SECRET!, { expiresIn: "1d" });

        const filter = { email: email };
        const updatedDoc = {
            $set: {
                lastLoggedIn: Date.now()
            }
        }

        await User.findOneAndUpdate(filter, updatedDoc);

        res.status(201).json({
            success: true,
            user: userExists,
            token
        })
    } else {
        res.json({
            success: false,
            message: "Password didn't match!",
        })
    }
})

userRouter.post("/logout", async (req: Request, res: Response) => {
    try {
        res.clearCookie("token");
        res.status(201).json({
            success: true,
            message: "Logging out successfully!"
        })
    } catch (err) {
        res.status(500).json({
            message: "Something went wrong!",
            error: err
        })
    }
})

userRouter.post("/reset-password", async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const userExists = await User.findOne({ email });

        if (!userExists) {
            return res.status(500).json({
                success: false,
                message: "User doesn't exist!"
            })
        }

        await OTP.deleteMany({ email });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        await OTP.create({
            email,
            otp,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        })

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        })

        const mailResponse = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Your password reset OTP",
            html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f4f4f4;">
                    <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; overflow: hidden;">
                        <div style="background: #007BFF; color: white; padding: 15px; text-align: center;">
                            <h2>Welcome to ClearQuity!</h2>
                        </div>
                        <div style="padding: 20px;">
                            <p>Hi <strong>there</strong>,</p>
                            <p>We’re excited to have you join us!</p>
                            <p>Your verification code is:</p>
                            <h2 style="text-align:left; color:#007BFF;">${otp}</h2>
                            <p>This code will expire in <strong>5 minutes</strong>.</p>
                            <p>Best regards, <br> The ClearQuity Team 💙</p>
                        </div>
                    </div>
                    </div>
  `,
        })

        res.status(201).json({
            success: true,
            message: "The OTP has been sent to user's gmail!",
            mailResponse
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "There's something wrong!",
            error: err
        })
    }
})

userRouter.post("/verify-otp", async (req: Request, res: Response) => {
    try {
        const { email, otp } = req.body;

        const otpExists = await OTP.findOne({ email, otp });

        if (!otpExists) {
            return res.status(400).json({
                success: false,
                message: "Something's wrong! Please try again!"
            })
        }

        if (otpExists.expiresAt < new Date()) {
            return res.status(401).json({
                success: false,
                message: "Your OTP is already expired!"
            })
        }

        await OTP.deleteOne({ otp });

        res.status(201).send({
            success: true,
            message: "Your OTP is verified successfully!",
        })
    } catch (err) {
        res.json({
            success: false,
            message: "Something went wrong!",
            error: err
        })
    }
})

userRouter.patch("/create-password/:email", async (req: Request, res: Response) => {
    try {
        const email = req.params.email;
        const { newPassword } = req.body;
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        if (hashedNewPassword) {
            const updatedDoc = {
                $set: {
                    password: hashedNewPassword
                }
            }

            const result = await User.findOneAndUpdate({ email }, updatedDoc, { new: true })

            res.status(201).json({
                success: true,
                message: "Password is successfully changed!",
                result
            })
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong with the request!",
            error: err
        })

        console.log(err)
    }
})

userRouter.patch("/promote-role/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const updatedDoc = {
            $set: {
                role: "seller"
            }
        }

        const result = await User.findByIdAndUpdate(id, updatedDoc, { new: true });

        res.status(201).json({
            success: true,
            message: "Role updated successfully!",
            result
        })
    } catch (err) {
        res.status(500).json({
            success: false,
            message: "Something went wrong!",
            err
        })
    }
})

userRouter.post("/ask-for-support", async (req: Request, res: Response) => {
    try {
        const { email, subject, feedback } = req.body;

        const result = await UserFeedback.insertOne({
            email, subject, feedback
        })

        res.json({
            success: true,
            message: "Feedback sent to the client!",
            result
        })
    } catch (err) {
        res.json({
            success: true,
            message: "Something went wrong",
            error: err
        })
    }
})

userRouter.get("/retrieve-feedbacks", async (req: Request, res: Response) => {
    try {
        const feedbacks = await UserFeedback.find();

        res.json({
            success: true,
            message: "Feedbacks retrived!",
            feedbacks
        })
    } catch (err) {
        res.json({
            success: true,
            message: "Something went wrong",
            error: err
        })
    }
})

export default userRouter;