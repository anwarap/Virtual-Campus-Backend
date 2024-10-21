import mongoose from "mongoose";


const TeacherSchema = new mongoose.Schema({
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
    },
    isVerified:{
        type:Boolean,
        default:false
    }


},{
    timestamps:true
});

const Teacher = mongoose.model('teacher',TeacherSchema);

export default Teacher;