import express, {Application, Request, Response} from "express";
import userRouter from "./controllers/user.controller";
import cors from 'cors';
import { contactRouter } from "./controllers/contactForm.controller";
import { propertyOperationRouter } from "./controllers/property.controller";

const app : Application = express();

app.use(cors({
    origin : ["http://localhost:5173", "http://localhost:5174", "https://clear-equity-git-sabbir-muhammad-sabbir-khan-alifs-projects.vercel.app"],
    credentials : true
}))

app.use(express.json());
app.use("/auth", userRouter);
app.use("/contact", contactRouter);
app.use("/property", propertyOperationRouter);

app.get("/", async( req : Request, res : Response) => {
    res.send("Welcome to ClearQuity!")
})

export default app;