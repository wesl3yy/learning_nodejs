import mongoose from "mongoose";

export function mongoConnect(url) {
    mongoose.connect(url);
    const database = mongoose.connection;
    return database;
}