import mongoose from "mongoose";
import { MONGO_URI } from "../constants";

export const connectDB = async () => {
  console.log(MONGO_URI)
  const conn = await mongoose.connect(MONGO_URI);
  console.log(
    `Mongo database connected on ${conn.connection.host}`
  );
};

