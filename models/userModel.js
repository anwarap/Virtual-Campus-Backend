import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    mobile:{
        type:String,
    }
},{
    timestamps:true
});


const User =  mongoose.model('User',UserSchema);
export default User;
