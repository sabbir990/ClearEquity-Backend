interface Offer{
    propertyID: string,
    offeredPrice: number,
    propertyCurrentPrice: number,
    buyerEmail: string,
    propertyOwnerEmail: string,
    status: "pending" | "accepted" | "rejected"
}

export default Offer;