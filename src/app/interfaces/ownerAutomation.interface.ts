export interface OwnerAutomation {
    ownerEmail : string,
    senderEmail : string,
    automation : {
        name : string,
        email : string,
        phone : number,
        message : string
    }
}