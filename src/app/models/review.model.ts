import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema<Review>({
    propertyID : {type: String, required: true},
    userEmail : {type: String, required: true},
    review : {type: String, required : true, trim: true}
})

const ReviewModel = mongoose.model("User Reviews", reviewSchema);

export default ReviewModel;