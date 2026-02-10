import mongoose, { Document } from "mongoose";
import { propertyDetails, comparativeAddressDetails } from "../interfaces/propertyDetails.interface.js";

// Extend the interface with Mongoose Document
interface IPropertyDocument extends propertyDetails, Document {}

const comparativeAddressSchema = new mongoose.Schema<comparativeAddressDetails>({
    address: { type: String, required: [true, "Comparative address is required!"], trim: true },
    price: { type: Number, required: [true, "Comparative price is required!"] },
    status: { 
        type: String, 
        required: [true, "Comparative status is required!"], 
        enum: ["sale", "sold out"], 
        lowercase: true, 
        default: "sale" 
    },
    beds: { type: Number, required: [true, "Number of beds is required!"] },
    baths: { type: Number, required: [true, "Number of baths is required!"] },
    size: { type: Number, required: [true, "Size is required!"] },
    websiteURL: { type: String, required: [true, "Website URL is required!"], trim: true },
}, { _id: false });

const propertyDetailsSchema = new mongoose.Schema<IPropertyDocument>(
    {
        propertyName: { 
            type: String, 
            required: [true, "Property Name is a required field!"], 
            trim: true 
        },
        propertyAddress: { 
            type: String, 
            required: [true, "Property Address is a required field!"], 
            trim: true 
        },
        propertyImages: { 
            type: [String], 
            required: [true, "Property Images are required!"], 
            default: ["https://img.freepik.com/free-photo/hotel_1127-4031.jpg"] 
        },
        price: { 
            type: Number, 
            required: [true, "Price is a required field!"] 
        },
        propertyType: { 
            type: String, 
            required: [true, "Property Type is a required field!"], 
            trim: true 
        },
        yearBuild: { 
            type: Number, 
            required: [true, "Year built is required!"] 
        },
        lotSize: { 
            type: String, 
            required: [true, "Lot size is required!"], 
            trim: true 
        },
        HOAFees: { 
            type: String, 
            required: [true, "HOA Fees is a required field!"], 
            trim: true 
        },
        propertyDescription: { 
            type: String, 
            required: [true, "Describing your property is required!"], 
            trim: true 
        },
        propertyOverviewVideoURLs: { 
            type: [String], 
            required: [true, "An overview of the property is required!"] 
        },
        interestRate: { 
            type: Number, 
            required: [true, "Interest rate is required!"], 
            default: 0.00 
        },
        propertyOwner: {
            name: { 
                type: String, 
                required: [true, "Adding owner's name is required!"], 
                trim: true 
            },
            designation: { 
                type: String, 
                required: [true, "Adding owner's designation is required!"], 
                trim: true 
            },
            email: { 
                type: String, 
                required: [true, "Adding owner's email is required!"], 
                trim: true, 
                lowercase: true 
            },
            phone: { 
                type: String, 
                required: [true, "Owner's phone number is required!"], 
                trim: true 
            },
            ownerImageURL: { 
                type: String, 
                required: [true, "Owner's image URL is required!"] 
            },
        },
        status: { 
            type: String, 
            required: [true, "Property status is required!"], 
            enum: ["sale", "sold out"], 
            lowercase: true, 
            default: "sale" 
        },
        propertyAccepted: { 
            type: Boolean, 
            required: true, 
            default: false 
        },
        views: { 
            type: Number, 
            required: true, 
            default: 1 
        },
        propertyHas: {
            beds: { 
                type: Number, 
                required: [true, "Bed number is required!"] 
            },
            baths: { 
                type: Number, 
                required: [true, "Bath number is required!"] 
            },
            sqrft: { 
                type: Number, 
                required: [true, "Area sqrft number is required!"] 
            },
            kitchen: { 
                type: Number, 
                required: [true, "Kitchen number is required!"] 
            },
            parking: { 
                type: Boolean, 
                required: [true, "Parking information is required!"] 
            },
        },
        comparativeAddress: {
            type: [comparativeAddressSchema],
            required: [true, "Comparative addresses are required!"],
            validate: {
                validator: function(v: any[]) {
                    return v.length === 4;
                },
                message: "Exactly 4 comparative addresses are required!"
            }
        },
        latitude: { 
            type: Number, 
            required: [true, "Latitude is required!"] 
        },
        longitude: { 
            type: Number, 
            required: [true, "Longitude is required!"] 
        },
        country: { 
            type: String, 
            required: [true, "Property location country is required!"], 
            trim: true 
        },
        reno: { 
            type: Number, 
            required: [true, "Reno is required!"] 
        },
        arv: { 
            type: Number, 
            required: [true, "ARV information is required!"] 
        }
    },
    { 
        timestamps: true // Adds createdAt and updatedAt automatically
    }
);

const PropertyModel = mongoose.model<IPropertyDocument>("Property", propertyDetailsSchema);

export default PropertyModel;