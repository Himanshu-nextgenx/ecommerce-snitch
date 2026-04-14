import { body, validationResult } from "express-validator";

const validateRequest = (req,res,next)=>{
    const errors = validationResult(req);   
    if(!errors.isEmpty()){          
        return res.status(400).json({           
            errors:errors.array()           
        })      
    }
    next();
};


 export const registerValidator = [
    body("email").isEmail().withMessage("Invalid email address"),
    body("contact").isMobilePhone().withMessage("Invalid contact number"),   
    body("password").isLength({min:6}).withMessage("Password must be at least 6 characters long"),
    body("fullname").notEmpty().withMessage("Full name is required"),
  body("isSeller").isBoolean().withMessage("isSeller must be a boolean value"),

validateRequest
]

export const loginValidator = [
    body("email").isEmail().withMessage("Invalid email address"),   
    body("password").notEmpty().withMessage("Password is required"),
    validateRequest
]