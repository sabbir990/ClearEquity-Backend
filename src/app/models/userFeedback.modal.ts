import mongoose from "mongoose";
import { userFeedback } from "../interfaces/userFeedback.interface";

const userFeedbackSchema = new mongoose.Schema<userFeedback>({
    email : {type : String, required : true, lowercase : true},
    subject : {type : String, required : true, trim : true },
    feedback : {type : String, required : true, trim : true}
})

const UserFeedback = mongoose.model("User Feedbacks", userFeedbackSchema);

export default UserFeedback;