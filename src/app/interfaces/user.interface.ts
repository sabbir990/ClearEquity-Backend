export interface User {
    username : string,
    email : string,
    password : string,
    NDAStatus : boolean,
    role: "admin" | "buyer" | "seller",
    lastLoggedIn : Date,
    status : "static" | "pending"
}
