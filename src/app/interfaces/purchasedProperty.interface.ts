interface PurchasedProperty {
    propertyID: string,
    customerEmail: string,
    status: "pending" | "sold",
    customerUsername : string
}

export default PurchasedProperty;