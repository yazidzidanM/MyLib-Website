import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const mongoDBURL = process.env.MONGO_DATABASE_URL || ""
const MongoDbName = process.env.MONGODB_NAME || ""

const mongoDB = async () => {
  try {
    await mongoose.connect(mongoDBURL, {
      dbName: MongoDbName,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 15000,
      serverSelectionTimeoutMS: 5000
    });
    return "connected";
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error);
    throw error;
  }
}

export default mongoDB;