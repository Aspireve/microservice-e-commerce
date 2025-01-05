import express from "express";
import { connectDB } from "./src/config/db";
import cors from "cors";
import { errorHandler, unknownEndpoints } from "./src/middleware/error";
import { NODE_ENV, PORT } from "./src/constants";
import authRouter from "./src/routes/auth";
import userRouter from "./src/routes/user";

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
