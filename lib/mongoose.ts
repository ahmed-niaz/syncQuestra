import mongoose, { Mongoose } from "mongoose";

import "@/database";
import logger from "./logger";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

// cache the connection [server action do not remember previous server action call]

interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

declare global {
  var mongoose: MongooseCache;
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<Mongoose> {
  // If a connection is already established, return it
  if (cached.conn) {
    logger.info("using existing mongoose connection");
    return cached.conn;
  }

  // Otherwise, create a new promise for connecting to the database
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "syncQuestra",
      })
      .then((result) => {
        logger.info("connected to mongodb");
        return result;
      })
      .catch((error) => {
        logger.error(error, "MongoDB connection failed");
        throw error;
      });
  }

  // Wait for the promise to resolve and cache the connection
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
