import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose"; 
const mongoURI = process.env.MONGODB_URI;  

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.log("MongoDB connection error: ", err);
    process.exit(1);
  }
};

export default connectDB;
