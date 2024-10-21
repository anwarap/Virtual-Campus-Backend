import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "anwaraliap2211@gmail.com",
        pass: process.env.EMAIL_PASSWORD,
    }
});


const sendVerificationMail = async(email, verif_code) => {
    const mailOptions = {
        from: "anwaraliap2211@gmail.com",
        to: email,
        subject: 'Vertual Campus Email Verification',
        text: `${email}, your verification code is ${verif_code}`,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent successfully');
        return { success: true, otp: verif_code };
    } catch (err) {
        console.error('Error sending verification email:', err);
        return { success: false, error: err };
    }
};

export default  sendVerificationMail;