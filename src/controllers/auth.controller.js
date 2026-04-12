import config from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";


const generateToken = (user,res,message)=>{
    const token = jwt.sign({id:user._id},config.jwtSecret,{
        expiresIn:"1d",
    })
    res.cookie("token",token)
    res.status(200).json({
        message,
        token,
        user:{id:user._id,
            email:user.email,
            contact:user.contact,
            fullname:user.fullname,
            role:user.role,
        }

    })

}


export const register = async (req,res)=>{
const {email,contact,password,fullname,role} = req.body;
    const isexist = await userModel.findOne({
        $or:[
           {email},
           {contact} 
        ],
        
    })
    if(isexist){
        return res.status(400).json({
            message:"User already exist"
        })
    }

    const user = await userModel.create({
        email,
        contact,
        password,
        fullname,
        role,
    })
    await  generateToken(user,res,"User registered successfully")

}
