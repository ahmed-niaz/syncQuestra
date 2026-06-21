import mongoose, { Mongoose } from "mongoose";

import "@/database";

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

        return cached.conn;
    }

    // Otherwise, create a new promise for connecting to the database
    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI, {
                dbName: "syncQuestra",
            })
            .then((result) => {

                return result;
            })
            .catch((error) => {

                throw error;
            });
    }

    // Wait for the promise to resolve and cache the connection
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;