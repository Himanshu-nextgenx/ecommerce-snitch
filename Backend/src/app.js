import express from "express";
import morgan from "morgan";
import cors from "cors";
import { dbconnection } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

dbconnection();

app.use(cors(
    
    {
        origin: "http://localhost:5173",
        credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    }
));
app.use("/api/auth", authRouter);


export default app;