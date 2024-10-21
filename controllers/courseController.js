import Course from "../models/courseModel.js";
import CloudinarySetup from "../utils/cloudinarySetup.js";

export const createCourse = async(req,res)=>{
    try {
        console.log(req.body,'request');
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
                    
                    const courseData = {
                        ...req.body,
                        cover: coverUploadResult.secure_url,
                        preview: previewUploadResult.secure_url,
                        lessons:JSON.parse(req.body.lessons)
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

        // saving to the database

        
            const savedCourse = await Course.create(courseData);
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
        console.error('Error:', error);
        return res.status(500).json({
            status: 500,
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
}
