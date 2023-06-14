require("dotenv").config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router()
const {User, Type} = require("./models.js");


router.post('/register', async (req, res) => {
    const { username, password, type } = req.body;
    try {
        const accountType = await Type.findOne({ code: type });
        if (!accountType) {
            return res.status(404).json({ 
                message: 'Account type not found' 
            });
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const data = new User({
            username: username,
            password: hashPassword,
            type_id: accountType._id,
    });
        const saveData = await data.save();
        res.status(200).json(saveData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password, type} = req.body;
    try {
        const accountType = await Type.findOne({code: type})
        const user = await User.findOne({ username, type_id: accountType._id });
        if (!user) {
            return res.status(404).json({ message: 'User not found!' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        const expiresIn = "365d";
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn });
        res.json({token, expires: expiresIn});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;