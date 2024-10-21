import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/connectDB.js';
import userRoute from './routes/userRoute.js';
import teacherRoute from './routes/teacherRoutes.js';
import adminRoute from './routes/adminRoutes.js';


dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT ;

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));


app.use("/api/user",userRoute);
app.use("/api/teacher",teacherRoute);
app.use("/api/admin",adminRoute);
app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
  