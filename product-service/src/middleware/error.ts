import { Request, Response, NextFunction } from "express";
import { Error as MongooseError } from "mongoose";

declare global {
  interface Error {
    status?: number;
  }
}

// Middleware for handling unknown endpoints
const unknownEndpoints = (): never => {
  const error: Error = new Error("Unknown Endpoints");
  error.status = 404;
  throw error;
};

// Middleware for handling errors
const errorHandler = (
    err: MongooseError | (MongooseError & { code?: number }),
    _: Request,
    res: Response,
    next: NextFunction // Required for proper middleware typing
  )  => {
    // Mongoose Bad ObjectId
    if (
      err instanceof MongooseError.CastError &&
      err.kind === "ObjectId"
    ) {
      return res.status(404).send({
        status: "Error",
        error: `Resource not found`,
      });
    }
  
    // Mongoose Validation Error
    if (err instanceof MongooseError.ValidationError) {
      const message = Object.values(err.errors)
        .map((val: MongooseError.ValidatorError | MongooseError.CastError) => val.message)
        .join(", ");
      return res.status(400).send({
        status: "Error",
        error: message,
      });
    }
  
    // Mongoose Duplicate Key Error
    if ("code" in err && err.code === 11000) {
      return res.status(409).send({
        status: "Error",
        error: "Duplicate value entered",
      });
    }
  
    // General Error
    res.status(err.status || 500).send({
      status: "Error",
      error: err.message || "Internal Server Error",
    });
  
    next(); // Ensure next is called, although not strictly necessary here
  };

export { unknownEndpoints, errorHandler };
