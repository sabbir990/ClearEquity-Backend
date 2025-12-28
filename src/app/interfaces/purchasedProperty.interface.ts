interface PurchasedProperty {
    propertyID: string,
    customerEmail: string,
    status: "pending" | "sold" | "rejected",
    customerUsername : string
}

export default PurchasedProperty;