import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
},{
    timestamps:true
})


const Admin = new mongoose.model("Admin",AdminSchema);
export default Admin;
