import express from "express";
import { connectDB } from "./config/db";
import path from "path";
import cors from "cors";
import { errorHandler, unknownEndpoints } from "./middleware/error";
import { NODE_ENV, PORT } from "./constants";
import orderRouter from "./routes/order";
import productRouter from "./routes/product";

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use("/order", orderRouter);
app.use("/product", productRouter);

if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));

  app.get("*", (_, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
} else {
  app.get("/", (_, res) => {
    res.send("OK");
  });
}

app.use(unknownEndpoints);
// @ts-ignore
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err: Error, _) => {
  console.log(`Error: ${err.message}`);
  server.close(() => process.exit(1));
});
