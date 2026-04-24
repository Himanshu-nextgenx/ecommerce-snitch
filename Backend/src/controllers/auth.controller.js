import config from "../config/config.js";
import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const generateToken = (user, res, message) => {
  const token = jwt.sign({ id: user._id , role: user.role  }, config.jwtSecret, {
    expiresIn: "1d",
  });
  res.cookie("token", token,
     {secure: false}
  );
  res.status(200).json({
    message,
    token,
    user: {
      id: user._id,
      email: user.email,
      contact: user.contact,
      fullname: user.fullname,
      role: user.role,
    },
  });
};

export const register = async (req, res) => {
  const { email, contact, password, fullname, isSeller } = req.body;
  const isexist = await userModel.findOne({
    $or: [{ email }, { contact }],
  });
  if (isexist) {
    return res.status(400).json({
      message: "User already exist",
    });
  }

  const user = await userModel.create({
    email,
    contact,
    password,
    fullname,
    role: isSeller ? "seller" : "buyer",
  });
  await generateToken(user, res, "User registered successfully");
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });  
  if (!user) {
    return res.status(400).json({
      message: "User not found",
    });
  }       

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({
      message: "Invalid credentials",
    });
  }   
  await generateToken(user, res, "User logged in successfully");
              
}

export const getme = async (req,res)=>{
  const user = await userModel.findById(req.user.id);
  if(!user){  
    return res.status(404).json({
      message:"User not found"
    })
}
res.status(200).json({
  message:"User fetched successfully",
  user:{
    id: user._id,
    email: user.email,
    contact: user.contact,
    fullname: user.fullname,
    role: user.role,
  }
});
}

export const googleAuthCallback = async (req, res) => {
const {id, displayName, emails,photos} = req.user;
const email = emails[0].value;
const profilePic = photos[0].value;

let user = await userModel.findOne({ email });
if (!user) {
  user = await userModel.create({
  email,
  googleId: id,
  fullname: displayName,
  
  });
}  
console.log(user) 
const token = jwt.sign({ id: user._id ,role: user.role}, config.jwtSecret, {
  expiresIn: "1d",
});
res.cookie("token", token, { httpOnly: true });
res.redirect("http://localhost:5173/");
}