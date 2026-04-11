import e from "express";
import mongoose from "mongoose";

const userSchema = new mongoose.schema({

    email:{
        type:String,    
        required:true,
        unique:true,
    },

    contact:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,      
    },
    fullname:{
        type:String,
        required:true,                              
    },

role:{
    type:String,
    enum:["buyer","seller"],
    default:"buyer",
}
    


})
userSchema.pre("save",async function(){
    if(!this.isModified("password"))
        return;
    
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;
    
    })

    userModel.methods.comparePassword = async function(password){
        return await bcrypt.compare(password,this.password);
    }

const userModel = mongoose.model("User",userSchema);
export default userModel;
