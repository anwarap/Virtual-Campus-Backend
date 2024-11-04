import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema({
  Amount:{
    type:Number,
  },
  date:{
    type:Date
  },
  teacherId:{
    type:String
  },
  userId:{
    type:String
  },
  courseName:{
    type:String
  },
  success: {
    type: Boolean,
    default: false,
  },

},{
    timestamps:true
});


const Payment =  mongoose.model('Payment',PaymentSchema);
export default Payment;
