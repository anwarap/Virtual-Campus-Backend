import cloudinary from "../config/cloudinary.js";
import fs from 'fs';

const CloudinarySetup = async (filePath,folder,resourceType ='auto') =>{
    try {
        const options = {folder,resource_type:resourceType};
        const result = await cloudinary.uploader.upload(filePath,options);

        fs.unlink(filePath, (err) => {
            if (err) {
                console.log("Error deleting file:", err);
            }
        });
        return result;
    } catch (error) {
        console.log("Cloudinary upload error:", error.message);
        throw error;
    }
}

export default CloudinarySetup;