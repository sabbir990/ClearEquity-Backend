import mongoose from "mongoose";
import { User } from "../interfaces/user.interface";

const userSchema = new mongoose.Schema<User>({
    username : {type : String, required : [true, "Username is a required field!"], trim : true},
    email : {type : String, required : [true, "Email is a required field!"], unique : [true, "Email already exists! Do you want to login instead?"], trim : true},
    password : {type : String, required : [true, "Password is a required field!"], trim : true},
    role : {type : String, required : true, default : "buyer"},
    createdAt : {type : Date, default : Date.now()}
})

const User = mongoose.model("User", userSchema);

export default User;