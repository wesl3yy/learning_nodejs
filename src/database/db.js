const mongoose = require('mongoose');

module.exports = function MongoConnect(url) {
    mongoose.connect(url);
    const database = mongoose.connection;
    return database;
}