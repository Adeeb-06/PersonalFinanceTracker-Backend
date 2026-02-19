import mongoose from "mongoose";

export const connectToDatabase = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables");
  }

  try {
    // Avoid using empty string as fallback; ensure URI is valid
    const connection = await mongoose.connect(MONGO_URI, {
      // These options are now default in latest mongoose, but explicit is better
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB:", connection.connection.host);
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error);
    process.exit(1); // exit process if DB connection fails
  }
};
