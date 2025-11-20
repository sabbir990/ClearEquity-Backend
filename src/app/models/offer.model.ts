import mongoose, {Schema, Model} from "mongoose";
import Offer from "../interfaces/offer.interface";

const offerSchema : Schema<Offer> = new mongoose.Schema<Offer>({
    propertyID: {type: String, required: true},
    offeredPrice : {type: Number, required: true},
    propertyCurrentPrice: {type: Number, required: true},
    buyerEmail: {type: String, required: true, lowercase: true},
    propertyOwnerEmail: {type: String, required: true, lowercase: true}
})

const Offers: Model<Offer> = mongoose.model<Offer>("Offers", offerSchema);

export default Offers;