import mongoose from "mongoose";
import { User } from "../interfaces/user.interface";

const userSchema = new mongoose.Schema<User>({
    username : {type : String, required : [true, "Username is a required field!"], trim : true},
    companyName: {type: String, trim: true},
    phone: {type: String, required: true},
    email : {type : String, required : [true, "Email is a required field!"], unique : [true, "Email already exists! Do you want to login instead?"], trim : true},
    password : {type : String, required : [true, "Password is a required field!"], trim : true},
    market: {type: String, required: [true, "Market Type is required field!"], trim: true},
    NDAStatus : {type : Boolean, default : false},
    role : {type : String, required : true, default : "buyer"},
    lastLoggedIn : {type : Date, default : Date.now()},
    status : {type : String, required : true, default : "static"}
}, {timestamps : true})

const User = mongoose.model("User", userSchema);

export default User;