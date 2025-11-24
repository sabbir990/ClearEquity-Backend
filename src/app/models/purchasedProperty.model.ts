import mongoose, {Schema, Model} from "mongoose";
import PurchasedProperty from "../interfaces/purchasedProperty.interface";

const purchasedPropertySchema : Schema<PurchasedProperty>  = new mongoose.Schema<PurchasedProperty>({
    propertyID: {type: String, required: true, trim: true},
    customerEmail: {type: String, required: true, trim: true, lowercase: true},
    status: {type: String, required: true, trim: true, lowercase: true, default: "pending"}
})

const purchasedProperties: Model<PurchasedProperty> = mongoose.model<PurchasedProperty>("Purchased Properties", purchasedPropertySchema);

export default purchasedProperties;