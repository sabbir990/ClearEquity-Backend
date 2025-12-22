interface Offer{
    propertyID: string,
    offeredPrice: number,
    propertyCurrentPrice: number,
    buyerEmail: string,
    propertyOwnerEmail: string,
    buyerName: string,
    propertyAddress: string,
    status: "pending" | "accepted" | "rejected" | "countered"
}

export default Offer;