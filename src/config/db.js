import config from "./config.js";
import mongoose from "mongoose";

export const dbconnection= async()=>{
    try {
        await mongoose.connect(config.mongoURI);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);

    }
}