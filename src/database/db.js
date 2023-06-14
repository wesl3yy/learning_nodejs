require('dotenv').config();
const mongoose = require('mongoose');
const mongoUrl = process.env.DATABASE_URI;

mongoose.connect(mongoUrl);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})