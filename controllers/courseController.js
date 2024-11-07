import Course from "../models/courseModel.js";
import Payment from "../models/paymentModel.js";
import User from "../models/userModel.js";
import CloudinarySetup from "../utils/cloudinarySetup.js";
import Stripe from 'stripe';



export const createCourse = async(req,res)=>{
    try {
        const filesReq = req;
        if(!filesReq.files){
            return res.status(400).json({message:"No file uploaded. Please upload a file."});
            }
            if(!filesReq.files.cover){
                return res.status(400).json({message:"No cover file uploaded. Please upload a file."});
                }
                if(!filesReq.files.preview){
                    return res.status(400).json({message:"No preview file uploaded. Please upload a file."});
                    }
                    const coverFile = filesReq.files.cover[0];
                    const previewFile = filesReq.files.preview[0];
                    
                    const coverUploadResult = await CloudinarySetup(coverFile.path,'course_cover','image');
                    const previewUploadResult = await CloudinarySetup(previewFile.path,'course_preview','video');
                  

                    let instructorId = req.body.instructor;
                    console.log(instructorId)


                    const courseData = {
                        ...req.body,
                        cover: coverUploadResult.secure_url,
                        preview: previewUploadResult.secure_url,
                        lessons:JSON.parse(req.body.lessons),
                        
                        }
                        
                        console.log(courseData,'course_data');
                            if (!courseData.title ||
                                !courseData.description ||
                                !courseData.category ||
                                !courseData.cover ||
                                !courseData.level ||
                                !courseData.preview ||
                                !courseData.price
                            ) {
                                return res.status(400).json({ message: 'No required information was provided' });
                            }

       

        
            const savedCourse = await Course.create(courseData);
            console.log(courseData,'jfsfjsf')
            return res.status(200).json(savedCourse);
       

    } catch (error) {
         console.error('Error:', error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}


export const getCourse = async(req,res)=>{
    try {
      const CourseData = await Course.find();
      res.json({data: CourseData});  
    } catch (error) {
        console.log('eieiieieieieie')
        console.error('Error:', error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}
export const createPaymentIntent = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        const amount = course.price * 100;

        let paymentIntent;
      
        if (req.body.paymentIntentId) {
            paymentIntent = await stripe.paymentIntents.retrieve(req.body.paymentIntentId);

            if (paymentIntent && paymentIntent.status === "succeeded") {
                return res.status(200).json({
                    clientSecret: paymentIntent.client_secret,
                    status: paymentIntent.status,
                });
            }
        }
        paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'inr',
            automatic_payment_methods: { enabled: true },
        });

        return res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
    }
};


export const handlePaymentSuccess =  async(req,res)=>{
    try {
       
        console.log(req.body,'SLKEI');
        const { amount, date, userId, courseId, courseName } = req.body;
        console.log(userId,'data');

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'User not found'});

        }
        console.log(user.courses,'sfsfsf')
        const courseExists = user.courses.some((course)=> course.courseId === courseId);
        console.log(courseExists,'qewqwqwqwqw')

        if(courseExists){
            return res.status(201).json({message: 'This course has already been purchased'});
        }else{
            const paymentData = new Payment({
                userId:userId,
                courseName:courseName,
                date:date,
                Amount:amount/100
            });
            const saveData = await paymentData.save();
            console.log(saveData,'ksfkjdsfhks');
            await User.updateOne({ _id: userId }, {
                $push: { courses: { courseId: courseId } }
            });
            return res.status(200).json({
                success: true,
                message: "Course purchase successful",
                saveData,
              });

        }

    } catch (error) {
        console.log('fsfsfsff')
        console.error('Error handling payment success:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
}