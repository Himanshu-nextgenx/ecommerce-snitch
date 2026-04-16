import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const isSeller = (req, res, next) => {
    console.log("TOKEN:", req.cookies);
  const token = req.cookies?.token;
    if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    if (decoded?.role !== "seller") {
      return res.status(403).json({
        message: "Forbidden",
        
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }


}

export const authMiddleware = (req, res, next) => {
  const token = req.cookies?.token;
    if (!token) {   

    return res.status(401).json({
      message: "Unauthorized",
    });
  }     
    try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}