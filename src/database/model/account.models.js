const mongoose = require('mongoose');

const userAccount = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    fullName: String,
    dob: String,
    phone: String,
    gender: String,
    address: String,
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
const User = mongoose.model("user_account", userAccount);

module.exports = {
    User,
};