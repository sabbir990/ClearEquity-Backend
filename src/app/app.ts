import express, {Application, Request, Response} from "express";
import userRouter from "./controllers/user.controller";

const app : Application = express();

app.use(express.json());
app.use("/auth", userRouter);

app.get("/", async( req : Request, res : Response) => {
    res.send("Welcome to ClearQuity!")
})

export default app;