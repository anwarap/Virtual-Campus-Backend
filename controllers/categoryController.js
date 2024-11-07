import Category from "../models/categoryModel.js";

export const createCategory = async (req,res)=>{
    try {
        let {name} = req.body;
        name = name.toLowerCase();
        const categoryExists = await Category.findOne({name});
        if (categoryExists) {
            return res.status(400).json({ message: "Category already exists" });
        }
        const newCategory = new Category({
            name: name,
        });
        const savedCategory = await newCategory.save();
        return res.status(200).json({Category: savedCategory})
    } catch (error) {
        return res.status(500).json({message:"Internal error"})
        
    }
}


export const getCategory = async (req, res) => {
    try {
        const data = await Category.find();
        return res.status(200).json({data});

    } catch (error) {
        return res.status(500).json({message:"Interval error"})
        
    }
}