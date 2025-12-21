import mongoose from "mongoose";
import CounterOfferInterface from "../interfaces/counterOffer.interface";

const counterOfferSchema = new mongoose.Schema<CounterOfferInterface>({
    offerID: {type: String, required: true},
    propertyID: {type: String, required: true},
    buyerEmail: {type: String, required: true, trim: true},
    offeredPrice: {type: Number, required: true},
    counterdPrice: {type: Number, required: true},
    propertyCurrentPrice: {type: Number, required: true},
    propertyOwnerEmail: {type: String, required: true, trim: true}
})

const Counter_Offer = mongoose.model("Counter Offer", counterOfferSchema);

export default Counter_Offer;