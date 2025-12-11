import mongoose from "mongoose";
import { propertyDetails } from "../interfaces/propertyDetails.interface";

const propertyDetailsSchema = new mongoose.Schema<propertyDetails>({
    propertyName : {type : String, required : [true, "Property Name is a required field!"], trim : true},
    propertyAddress : {type : String, required : [true, "Property Address is a required field!"], trim : true},
    propertyImages : {type : [String], required : [true, "Property Images are required!"], default : ["https://img.freepik.com/free-photo/hotel_1127-4031.jpg"]},
    price : {type : Number, required : [true, "Price is a required field"]},
    propertyType : {type : String, required : [true, "Property Type is a required field!"]},
    yearBuild : {type : Number, required : false},
    lotSize : {type : String, required : false},
    HOAFees : {type : String, required : [true, "HOA Fees is a required field!"]},
    propertyDescription : {type : String, required : [true, "Describing your property is required!"], trim : true},
    propertyOverviewVideoURLs : {type : [String], required : [true, "An overview of the property is required!"]},
    interestRate : {type: Number, required : [true, "Interest rate is required!"], default : 0.00},
    propertyOwner : {
        name : {type : String, required : [true, "Adding owner's name is required!"], trim : true},
        designation : {type : String, required : [true, "Adding owner's designation is required!"], trim : true},
        email : {type : String, required : [true, "Adding owner's email is required!"], trim : true, lowercase : true},
        phone : {type : Number, required : [true, "Owner's phone number is required!"]},
    },
    status : {type : String, required : [true, "Property status is required!"], lowercase : true, default : "sale"},
    propertyAccepted : {type : Boolean, required : true, default : false},
    views : {type : Number, required : true, default : 1},
    propertyHas : {
        beds : {type : Number, required : [true, "Bed number is required!"]},
        baths : {type : Number, required : [true, "Bath number is required!"]},
        sqrft : {type : Number, required : [true, "Area sqrft number is required!"]},
        kitchen : {type : Number, required : [true, "Kitchen number is required!"]},
        parking : {type: String, required : [true, "Parking information is required!"]},
    },
    country : {type : String, required : [true, "Property location country is required!"]},
    reno : {type: Number, required: [true, "Reno is required!"]},
    arv: {type: Number, required: [true, "ARV informations is required!"]}
})

const Property = mongoose.model("Property", propertyDetailsSchema);

export default Property;