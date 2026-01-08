interface Offer{
    propertyID: string,
    offeredPrice: number,
    propertyCurrentPrice: number,
    buyerEmail: string,
    propertyOwnerEmail: string,
    buyerName: string,
    propertyAddress: string,
    minimumEMD: number,
    sattlementDate: string,
    status: "pending" | "accepted" | "rejected" | "countered",
}

export default Offer;