import express from 'express';
import { forgetPassword1, forgetPassword2, forgetPassword3, resendOtp, teacherLogin, teacherOtpVerification, teacherSignup, teacherlogout } from '../controllers/teacherController.js';
import { getCategory } from '../controllers/categoryController.js';
import { createCourse } from '../controllers/courseController.js';
import { upload } from '../config/multer.js';


const teacherRoute = express.Router();

teacherRoute.post("/signup",teacherSignup)
teacherRoute.post("/verify",teacherOtpVerification);
teacherRoute.post("/login",teacherLogin);
teacherRoute.post("/logout",teacherlogout);
teacherRoute.get("/resend-otp",resendOtp);
teacherRoute.post("/forget-password1",forgetPassword1);
teacherRoute.post("/forget-password2",forgetPassword2);
teacherRoute.post("/forget-password-final",forgetPassword3);
teacherRoute.get("/category",getCategory)
teacherRoute.post("/add-course",upload,createCourse)

export default teacherRoute;