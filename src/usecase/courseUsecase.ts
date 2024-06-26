import Course from "../domain/course";
import CloudinarySetup from "../infrastructure/utils/cloudinarySetup";
import CourseInterface from "./interface/courseInterface";


class CourseUsecase {
    constructor(
        private courseInterface: CourseInterface,
        private cloudinarySetup: CloudinarySetup
    ){}

    async createCourse(course: Course){
        try {
            console.log(course.cover,'wwwww')
            if(!course.title||
                !course.description||
                !course.category ||
                !course.cover ||
                !course.level ||
                !course.preview||
                !course.price
            ) {
                return {
                    status:400,
                    data:{
                        message: 'No required information was provided'
                    }
                }
            }
           
            
           const courseData = await this.courseInterface.createCourse(course) 
           if(courseData){

               return {
                status: 200,
                data : courseData
            }
           }
        } catch (error) {
            return {
                status: 400,
                data : {
                    message:'Error create course'
                }
            }
        }
    }
}


export default CourseUsecase;