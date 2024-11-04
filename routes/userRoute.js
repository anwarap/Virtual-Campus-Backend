import express from "express";
import { userSignup ,
    userOtpVerification,
    resendOtp,
    forgotPassword1,
    forgetPassword2,
    forgetPassword3,
    userLogin,
    logout,
} from "../controllers/userController.js";
import { createPaymentIntent,
    handlePaymentSuccess,
 } from "../controllers/courseController.js";
const userRoute = express.Router();



userRoute.post("/signup", userSignup);
userRoute.post("/verify",userOtpVerification);
userRoute.post("/signin",userLogin);
userRoute.post("/logout",logout);
userRoute.get("/resend-otp",resendOtp);
userRoute.post("/forget-password1",forgotPassword1);
userRoute.post("/forget-password2",forgetPassword2);
userRoute.post("/forget-password-final",forgetPassword3);
userRoute.post('/create-payment-intent', createPaymentIntent);
userRoute.post('/success',handlePaymentSuccess)




export default userRoute;