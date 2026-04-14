import express from "express";
import morgan from "morgan";
import config from "./config/config.js";
// import cors from "cors";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { dbconnection } from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

dbconnection();
app.use(passport.initialize());
passport.use(
  new GoogleStrategy(
    {
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret: config.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));

// app.use(cors(
    
//     {
//         origin: "http://localhost:5173",
//         credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     }
// ));
app.use("/api/auth", authRouter);


export default app;