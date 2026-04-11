import express from "express";
import morgan from "morgan";
import { dbconnection } from "./config/db";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

dbconnection();


app.use("/api/auth", authRouter);


export default app;