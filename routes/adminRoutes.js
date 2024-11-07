import express from "express";
import { adminLogin, approveCourse, blockCategory, blockTeacher, blockUser, getTeachers, getUsers } from "../controllers/adminController.js";
import { createCategory, getCategory } from "../controllers/categoryController.js";
import { getCourse } from "../controllers/courseController.js";



const adminRoute = express.Router();

adminRoute.post("login",adminLogin);
adminRoute.get("/users",getUsers);
adminRoute.get("/teachers",getTeachers);
adminRoute.post("/block-user/:id",blockUser);
adminRoute.post("/block-teacher/:id",blockTeacher);
adminRoute.get("/category",getCategory);
adminRoute.post("/create-category",createCategory);
adminRoute.get("/get-courses",getCourse);
adminRoute.put("/courses/:id/status",approveCourse);
adminRoute.post("/block-category/:id",blockCategory);



export default adminRoute;


