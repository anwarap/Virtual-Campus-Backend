import User from "../models/userModel.js";
import genOtp from "../utils/generateOtp.js";
import { compare, createHash } from "../utils/hashedPassword.js";
import sendVerificationMail from "../utils/nodeMailer.js";
import { generateToken } from "../utils/jwt.js";



export  const userSignup = async (req,res)=>{
    try {
        const {name,email,password,mobile}= req.body;
        const userExists = await User.findOne({email});

        if(userExists){
            return res
            .status(401)
            .json({message: "Email already exists"})
        }
        const hashedPassword = await createHash(password);
        const otp = await genOtp(6);
        const verify = await sendVerificationMail(email,otp);
        console.log(verify,'fafa');
        req.app.locals.otp = verify.otp;

        
        const user = new User({
            name:name,
            email:email,
            password:hashedPassword,
            mobile: mobile
        })

        req.app.locals.user = user;
        return res.status(200).json({response: verify});
    } catch (error) {
        return res.status(500).json({message:"Interval error"})
    }
}

 export const userOtpVerification = async (req, res) => {
    try {
        const user = req.app.locals.user;
        const generatedOtp = req.app.locals.otp;
        const enteredOtp = req.body.otp;
        console.log(generatedOtp, 'generatedOtp');

        if (enteredOtp === generatedOtp) {
            const userData = await user.save();
            req.app.locals.user = null;
            req.app.locals.otp = null;
            return res.status(200).json({ userSave: userData });
        } else {
            return res.status(401).json({  message: "Invalid OTP" });
        }
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const user = req.app.locals.user;
        const otp = await genOtp(6);
        const verify = await sendVerificationMail(user.email,otp);
        console.log(verify,'sfse')
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
};



export const userLogin = async(req,res)=>{
    try {
        const {email,password}= req.body;
        const user = await User.findOne({email});

        if(!user){
            return res.status(401).json({message: "User not found"});
        }
        if(user.isBlocked){
            return res.status(401).json({message: "You are Blocked by Admin"});
        }

        const passwordMatch = await compare(password, user.password);
        if(!passwordMatch){
            return res.status(401).json({message: "Invalid User Credentials"});
        }
        const token = generateToken(user._id, user.name, user.email, "user");
        res.cookie("UserJWT", token, {
            withCredentials: true,
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });

        console.log(token,'token')
        res.status(200).json({ message: "Login successful", token ,userData:user});
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}







      

export const forgotPassword1 = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({email});
        const otp = await genOtp(6);
        const verify = await sendVerificationMail(email,otp);
        console.log( otp,'sfswf');

        req.app.locals.otp = verify.otp;
        return res.status(user.status).json(user.data);
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
};


export const forgetPassword2 = async (req, res) => {
    try {
        console.log(req.app.locals.otp,'otplocal')
        console.log(req.body.otp,'body')
        if(req.body.otp != req.app.locals.otp){
           return  res.status(401).json({message:"otp does not matchh"})
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
        const user  = User.findOne({email});
        if(user){
            user.password = await createHash(password);
            const userData = await user.save();
            return {
                status:200,
                data:"Password updated"
            }

        }else{
            return {
                status:401,
                data:{message:"password not matching"}
                
            }
        }        
    } catch (error) {
        return res.status(500).json({
            data:{status:500, message:"Internal Server Error",
                error:error.message
            }});
    }
}


export const logout = async(req,res)=>{
    try {
        res.cookie("UserJWT", "", {
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




