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
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    fullName: String,
    dob: String,
    phone: String,
    gender: String,
    address: String,
    is_active: {
        type: Boolean,
        default: false
    },
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

const userToken = mongoose.Schema({
    token: {
        type: String,
        unique: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userAccount",
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});
const UserToken = mongoose.model("user_token", userToken)

module.exports = {
    User,
    UserToken
};