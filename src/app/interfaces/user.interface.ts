export interface User {
    username : string,
    email : string,
    password : string,
    role: "admin" | "buyer" | "seller"
    createdAt?: Date,
    updatedAt : string
}
