import Admin from "../models/adminModel.js";
import Category from "../models/categoryModel.js";
import Course from "../models/courseModel.js";
import Teacher from "../models/teacherModel.js";
import User from "../models/userModel.js";
import { compare } from "../utils/hashedPassword.js";
import { generateToken } from "../utils/jwt.js";

export const adminLogin = async (req,res)=>{
    try {
        const {email,password}= req.body;
        const admin =  await Admin.findById({email})
        if(!admin){
            return res.status(401).json({message:"Admin not found"});
        }
        const passwordMatch = await compare(password,admin.password)
        if(!passwordMatch){
            return res.status(401).json({message:"Invalid Credentials"});
        }

        const token = generateToken(admin._id, admin.email, "admin");
        res.cookie("AdminJWT", token, {
            withCredentials: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "Login successful", token ,adminData:admin});
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}

export const getUsers = async (req,res)=>{
    try {
        const userList = await User.find({})
        if(!userList){
            return res.status(404).json({message:"User not found"});
        }
        return res.status(200).json({data:userList});
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}

export const getTeachers = async (req, res) => {
    try {
        const teacherList = await Teacher.find()
        if(!teacherList){
            return res.status(404).json({message:"Teacher not found"});
        }
        return res.status(200).json({data: teacherList});
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}


export const blockUser = async (req, res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({message: "User not found"}); 
        }else{
            const updated = await User.findByIdAndUpdate(id,{
                $set:{isBlocked:!user.isBlocked}
            },{new:true});
            return res.status(200).json({data:updated});
        }

    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}

export const blockTeacher = async (req,res) =>{
    try {
        const {id} = req.params;
        const teacher = await Teacher.findById(id);
        if(!teacher){
            return res.status(404).json({message:"Teacher not found"});
        }else{
            const updated = await Teacher.findByIdAndUpdate(id,{
                $set:{isBlocked:!teacher.isBlocked}
            },{new:true});

            return res.status(200).json({data:updated});  
        }
        
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}

export const approveCourse = async(req,res)=>{
    
    try {
        const {id} = req.params;
        const {isApproved} = req.body;

        const updatedCourse = await Course.findByIdAndUpdate(
            id,
            {isApproved},
            {new:true}
        );
        res.status(200).json(updatedCourse);
        
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}

export const blockCategory = async (req,res)=>{
    try {
        const {id} = req.params;
        const category = await Category.findById(id);
        if(!category){
            return res.status(404).json({message:"Category not found"});
        }else{
            const updated = await Category.findByIdAndUpdate(id,{
                $set:{block :!category.block }
            },{new:true});
            return res.status(200).json({data:updated});
        }

    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}