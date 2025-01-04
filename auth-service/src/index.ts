import express from "express";
import { connectDB } from "./config/db";
import cors from "cors";
import { errorHandler, unknownEndpoints } from "./middleware/error";
import { NODE_ENV, PORT } from "./constants";
import authRouter from "./routes/auth";
import userRouter from "./routes/user";

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use("/auth", authRouter);
app.use("/user", userRouter);

console.log(NODE_ENV, PORT)

app.use(unknownEndpoints);
// @ts-ignore
app.use(errorHandler);

const server = app.listen(PORT || 3000, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err: Error, _) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
