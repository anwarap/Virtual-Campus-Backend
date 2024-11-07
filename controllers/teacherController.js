import { compare } from "bcrypt";
import Teacher from "../models/teacherModel.js";
import genOtp from "../utils/generateOtp.js";
import { createHash } from "../utils/hashedPassword.js";
import sendVerificationMail from "../utils/nodeMailer.js";
import { generateToken } from "../utils/jwt.js";
import Course from "../models/courseModel.js";


export const teacherSignup = async(req,res)=>{
    try {
        const {name,email,password,mobile} = req.body;
        const teacherExists = await Teacher.findOne({email});

        if(teacherExists){
            return res
            .status(401)
            .json({message:"Email already exists"})
        };

        const hashedPassword = await createHash(password);
        const otp = await genOtp(6);
        console.log(otp,'ororror')
        const verify = await sendVerificationMail(email,otp);
        req.app.locals.otp = verify.otp;

        const teacher = new Teacher({
            name:name,
            email:email,
            password:hashedPassword,
            mobile:mobile
        });
        req.app.locals.teacher = teacher;

        if (teacher && req.body.is_google === true) {

            const hashedPassword = await createHash(req.body.password);
            teacher.password = hashedPassword;
            const teacherData = await teacher.save();
        
        
            return res.status(200).json({ teacherSave: teacherData });
        }

        return res.status(200).json({response: verify});

    } catch (error) {
        return res.status(500).json({message:"Interval error"})
    }
}


export const teacherOtpVerification = async(req,res)=>{
    try {
        const teacher = req.app.locals.teacher;
        const generatedOtp = req.app.locals.otp;
        const enteredOtp = req.body.otp;
        console.log(generatedOtp,'geeenereated');
        console.log(enteredOtp,'entered');
        if(enteredOtp === generatedOtp){
            const teacherData = await teacher.save();
            req.app.locals.user = null;
            req.app.locals.otp = null;
            return res.status(200).json({teacherSave: teacherData});
        }else{
            return res.status(401).json({message: "Invalid OTP" });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
}

export const resendOtp = async (req,res)=>{
    try {
        const teacher = req.app.locals.teacher;
        const otp = await genOtp(6);
        console.log(otp,'ptoeoro')
        const verify = await sendVerificationMail(teacher.email,otp);
        req.app.locals.otp = verify.otp;

        setTimeout(()=>{
            req.app.locals.otp = undefined;
        },1000 * 30);
        return res.status(200).json({response:verify});
       
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}


export const teacherLogin = async(req,res)=>{
    try {
        const {email,password} =req.body;
        const teacher = await Teacher.findOne({email});

        if(!teacher){
            return res.status(401).json({message:"Teacher not found"})
        }
        if(teacher.isBlocked){
            return res.status(401).json({message:"You are blocked by admin"})
        }
        const passwordMatch = await compare(password,teacher.password);
        if(!passwordMatch){
            return res.status(401).json({message:"Invalid User Credentials"});
        }
        const token =  generateToken(teacher._id, teacher.name,teacher.email,"teacher");
        res.cookie("TeacherJWT", token, {
            withCredentials: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        console.log(token,'token')
        res.status(200).json({ message: "Login successful", token ,teacherData:teacher});

    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}

export const forgetPassword1 = async (req, res) => {
    try {
        const email = req.body.email;
        const teacher = await Teacher.findOne({email});
        if(!teacher){
            return res.status(404).json({message: 'Teacher not found'});
        }
        const otp = await genOtp(6);
        const verify = await sendVerificationMail(email,otp);
        console.log(otp,'verify');
        req.app.locals.otp = verify.otp;
        return res.status(200).json(verify);
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}


export const forgetPassword2 = async (req, res) => {
    try {
        console.log(req.app.locals.otp,'otplocal')
        console.log(req.body.otp,'body')
        if(req.body.otp != req.app.locals.otp){
           return  res.status(401).json({message:"otp does not match"})
        }else{
           req.app.locals.otp = null;
           return  res.status(200).json({message:"Otp verification successful"})
        }
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
};




export const forgetPassword3 = async (req, res) => {
    try {
        const {email, password} = req.body;
        const teacher  = await Teacher.findOne({email});
        if(teacher){
            teacher.password = await createHash(password);
            const teacherData = await teacher.save();
            return res.status(200).json(teacherData);

        }else{
            return res.status(401).json({message:"password not match"})
        }        
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}



export const teacherlogout = async(req,res)=>{
    try {
        res.cookie("TeacherJWT", "", {
            httpOnly: true,
            maxAge: 0
        });
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}

export const getCoursesOfTeacher = async(req, res) => {
    try {
        console.log('ddadad')
        const {teacherId} = req.params;
        console.log(teacherId,'fsfsf')
        const courses = await Course.find({instructor:teacherId}).populate('instructor');
        console.log(courses,'cocoococ');
        res.status(200).json({data: courses});
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}
