import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    block:{
        type:Boolean,
        default:false,
    }
})

const Category = mongoose.model('Category', CategorySchema);
export default Category;