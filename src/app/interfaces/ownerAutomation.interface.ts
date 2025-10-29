export interface OwnerAutomation {
    ownerEmail : string,
    senderEmail : string,
    propertyID : string,
    propertyStatus : string,
    automation : {
        name : string,
        email : string,
        phone : number,
        message : string
    }
}