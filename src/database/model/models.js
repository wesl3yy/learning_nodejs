const mongoose = require('mongoose');

const accountType = mongoose.Schema({
    title: String,
    code: {
        required: true,
        type: String,
        unique: true
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
const Type = mongoose.model("account_type", accountType);


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
    fullname: String,
    dob: Date,
    phone: String,
    gender: String,
    address: String,
    type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "accountType",
        required: true
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

module.exports = {
    Type,
    User,
};