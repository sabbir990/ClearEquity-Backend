export interface User {
    username : string,
    companyName: string,
    phone: string,
    email : string,
    password : string,
    market: string,
    NDAStatus : boolean,
    role: "admin" | "buyer" | "seller",
    lastLoggedIn : Date,
    status : "static" | "pending"
}
