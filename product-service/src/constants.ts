import dotenv from "dotenv";

dotenv.config();

export const MONGO_URI: string = process.env.MONGO_URI!;
export const PORT: number = parseInt(process.env.PORT!, 10) || 3000;
export const NODE_ENV: string = process.env.NODE_ENV!;
export const JWT_SECRET: string = process.env.JWT_SECRET!;
export const JWT_EXPIREIN: string = process.env.JWT_EXPIREIN!;
