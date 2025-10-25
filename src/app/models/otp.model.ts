import mongoose from 'mongoose';
import { OTPObj } from '../interfaces/otp.interface';

const otpSchema = new mongoose.Schema<OTPObj>({
    email : {type : String, required : true},
    otp : {type : String, required : true},
    expiresAt : {type : Date, required : true}
})

const OTP = mongoose.model("OTP", otpSchema);

export default OTP;