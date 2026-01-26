import mongoose from "mongoose";

export const connectToDatabase = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI || "");
    console.log("Connected to MongoDB:", connect.connection.host);
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
  }
}