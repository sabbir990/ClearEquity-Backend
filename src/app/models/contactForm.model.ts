import mongoose from "mongoose";
import contactInfo from "../interfaces/contactForm.interface";

const contactFormSchema = new mongoose.Schema<contactInfo>({
    firstName : {type : String, required : [true, "First Name is a required field!"], trim : true},
    lastName : {type : String, required : [true, "Last Name is a required field!"], trim : true},
    email : {type : String, required : [true, "Email is a required field!"], trim : true, lowercase: true},
    phone : {type : Number, required : false, trim : true},
    subject : {type : String, required : [true, "Subject is a required field!"], trim : true, default : "Reaching out for learning more!"},
    message : {type : String, required : [true, "Message is a required field!"], trim : true}
})

const ContactInfo = mongoose.model("ContactInfo", contactFormSchema);

export default ContactInfo;