import express, {Application, Request, Response} from "express";
import userRouter from "./controllers/user.controller";
import cors from 'cors';
import { contactRouter } from "./controllers/contactForm.controller";

const app : Application = express();

app.use(cors({
    origin : ["http://localhost:5173", "http://localhost:5174"],
    credentials : true
}))

app.use(express.json());
app.use("/auth", userRouter);
app.use("/contact", contactRouter);

app.get("/", async( req : Request, res : Response) => {
    res.send("Welcome to ClearQuity!")
})

export default app;