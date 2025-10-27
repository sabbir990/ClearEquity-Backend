import app from "./app";
import dotenv from "dotenv";
import {Server} from "http";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from 'cors';

dotenv.config();
app.use(cookieParser());

app.use(cors({
    origin : "http://localhost:5173",
    credentials : true
}))

let server : Server;
let PORT = process.env.PORT || 5000;

export async function main (){
    await mongoose.connect(process.env.MONGODB_URI_STRING!);

    console.log("ClearQuity server is connected to MongoDB through Mongoose!")

    app.listen(PORT, () => {
        console.log(`Our ClearQuity server is running on PORT ${PORT}`)
    })
}

main();