import { Router } from "express";
import { registerValidator,loginValidator } from "../validators/auth.validator.js";
import { register,login ,googleAuthCallback } from "../controllers/auth.controller.js";
import passport from "passport";

const authRouter = Router();

authRouter.post("/register", registerValidator,register)
authRouter.post("/login", loginValidator, login)



authRouter.get("/google",
    passport.authenticate("google", { scope: [ "profile", "email" ] }))

    authRouter.get("/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login" }),
    googleAuthCallback)

export default authRouter;