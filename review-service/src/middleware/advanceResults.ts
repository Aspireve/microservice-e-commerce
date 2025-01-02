import { Request, Response, NextFunction } from "express";
import { Model, PopulateOptions } from "mongoose";

interface AdvancedResults<T> {
  status: string;
  count: number;
  results: T[];
  pagination?: Record<string, any>;
}

declare global {
  namespace Express {
    interface Request {
      advanceResults?: AdvancedResults<any>;
    }
  }
}

declare global {
  namespace Express {
    interface Response {
      advanceResults?: AdvancedResults<any>;
    }
  }
}

const advanceResults =
  <T extends any>(
    model: Model<T>,
    populate?: PopulateOptions
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let query;

      const reqQuery = { ...req.query };

      // Fields to exclude
      const removeFields = ["select", "sort", "limit", "page"];
      removeFields.forEach((param) => delete reqQuery[param]);

      // Create query string
      let queryStr = JSON.stringify(reqQuery);

      // Add MongoDB operators ($gt, $gte, etc.)
      queryStr = queryStr.replace(
        /\b(gt|gte|lt|lte|in)\b/g,
        (match) => `$${match}`
      );

      // Find resources
      query = model.find(JSON.parse(queryStr));

      // Select specific fields
      if (req.query.select) {
        const fields = (req.query.select as string).split(",").join(" ");
        query = query.select(fields);
      }

      // Sort results
      if (req.query.sort) {
        const sortBy = (req.query.sort as string).split(",").join(" ");
        query = query.sort(sortBy);
      } else {
        query = query.sort("-createdAt");
      }

      // Pagination (optional)
      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 25;
      const startIndex = (page - 1) * limit;
      const total = await model.countDocuments();

      query = query.skip(startIndex).limit(limit);

      if (populate) {
        query = query.populate(populate);
      }

      // Execute query
      const results = await query;

      // Pagination results
      const pagination: Record<string, any> = {};
      if (startIndex + limit < total) {
        pagination.next = { page: page + 1, limit };
      }
      if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
      }

      // Set results in response
      res.advanceResults = {
        status: "success",
        count: results.length,
        results,
        pagination,
      };

      next();
    } catch (error) {
      next(error);
    }
  };

export default advanceResults;
