require("dotenv").config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require("moment");
const jwt_token = require("../authenticate/authen");
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

router.put('/update/:username', jwt_token, async (req, res) => {
    const userName = req.params.username;
    const {fullname, dob, phone, gender, address} = req.body;
    const dobValue = moment(dob, 'DD/MM/YYYY').toDate();
    try {
        const update = {
            fullname: fullname,
            dob: dobValue,
            phone: phone,
            gender: gender,
            address: address
        }
        const filter = {
            username: userName,
            _id: req.user.id
        }
        const updateUser = await User.findOneAndUpdate(filter, update, {new: true});
        if (!updateUser){
            return res.status(403).json({message: "Invalid error"})
        }
        return res.status(200).send(updateUser);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

router.get('/user/:username', jwt_token, async (req, res) => {
    const userName = req.params.username;
    const userId = req.user.id;
    try {
        const user = await User.findOne({_id: userId, username: userName});
        if (!user){
            return res.status(403).json({message: "User not found!"});
        }
        return res.status(200).json(user);
    } catch (error) {
        return res.status(400).json({message: error.message});        
    }
});


module.exports = router;