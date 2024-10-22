import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    level:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    cover:{
        type: String,
        required: true
    },
    preview:{
        type: String,
        required: true
    },
    instructor:{
        type:mongoose.Types.ObjectId,
        ref:"Teacher"
    },
    lessons:[
        {
            content:String,
            title:String,
        }
    ],
    isApproved:{
        type:Boolean,
        default:false
    }
});

const Course = mongoose.model("course",CourseSchema);
export default Course;