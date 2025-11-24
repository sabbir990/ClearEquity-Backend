interface PurchasedProperty {
    propertyID: string,
    customerEmail: string,
    status: "pending" | "sold",
}

export default PurchasedProperty;