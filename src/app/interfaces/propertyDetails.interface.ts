export interface propertyDetails {
    propertyName : string,
    propertyAddress : string,
    price : number,
    propertyImages : string[],
    propertyType : string,
    yearBuild : number,
    lotSize : string,
    HOAFees : string,
    propertyDescription : string,
    propertyOverviewVideoURL : string,
    propertyFloorPlanFile : string,
    interestRate : number,
    propertyOwner : {
        name : string,
        designation : string,
        email : string,
        phone : string,
    },
    status : "sale" | "sold out",
    propertyAccepted : Boolean,
    views : number
}