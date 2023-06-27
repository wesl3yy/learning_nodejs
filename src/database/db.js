import mongoose from "mongoose";

/**
 * @param {string} url 
 * @returns { mongoose.Connection }
 */
export function mongoConnect(url) {
    mongoose.connect(url);
    const database = mongoose.connection;
    return database;
}