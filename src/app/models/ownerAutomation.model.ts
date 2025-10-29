import mongoose from "mongoose";
import { OwnerAutomation } from "../interfaces/ownerAutomation.interface";

const ownerAutomationSchema = new mongoose.Schema<OwnerAutomation>({
    ownerEmail : {type : String, required : [true, "Owner's email is required!"], trim : true, lowercase : true},
    senderEmail : {type : String, required : [true, "Sender's email is required!"], trim : true, lowercase : true},
    propertyID : {type : String, required : true},
    propertyStatus : {type : String, required : true, lowercase : true},
    automation : {
        name : {type : String, required : [true, "Sender's name is required!"], trim : true},
        email : {type : String, required : [true, "Sender's email is required!"], trim : true, lowercase : true},
        phone : {type : Number, required : [true, "Sender's phone is required!"]},
        message : {type : String, required : [true, "A message is important. So it's required!"], trim : true}
    }
})

const OwnerAutomatomations = mongoose.model("Owner Automations", ownerAutomationSchema);

export default OwnerAutomatomations;