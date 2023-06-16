const jwt_token = require("../authenticate/authentication");
const express = require('express');
const Error = require("../../common/general");

function AccountController(accountServices, accountTypeServices) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    const { username, password, type } = req.body;
    try {
      const accountType = await accountTypeServices.findType(type);
      const account = await accountServices.create(username, password, accountType._id);
      return res.status(200).json(account);
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  });

  router.post('/login', async (req, res) => {
    const {username, password, type} = req.body;
    try {
      const accountType = await accountTypeServices.findType(type);
      const user = await accountServices.findUserAndType(username, accountType._id);
      if (user.message == Error.NotFound){
        return res.status(400).json(user);
      }
      const expiresIn = "365d";
      const token = await accountServices.login(user, password, expiresIn);
      if (token.message == Error.WrongPassword){
        return res.status(403).json(token);
      }
      return res.status(200).json(token);
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  });

  router.put('/update/:username', jwt_token, async (req, res) => {
    const username = req.params.username;
    const {fullname, dob, phone, gender, address} = req.body;
    try {
      const update = {
        fullname: fullname,
        dob: dob,
        phone: phone,
        gender: gender,
        address: address
      }
      const filter = {
        username: username,
        _id: req.user.id
      }
      const options = {new: true, select: '-password'};
      const updateUser = await accountServices.findUserAndUpdate(update, filter, options);
      if (updateUser.message == Error.NotFound) {
        return res.status(403).json(updateUser);
      }
      return res.status(200).send(updateUser);
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  });

  router.get('/user/:username', jwt_token, async (req, res) => {
    const username = req.params.username;
    const userId = req.user.id;
    try {
      const user = await accountServices.findUserByName(userId, username);
      if (user.message == Error.NotFound) {
        return res.status(400).json(user);
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({message: error.message})
    }
  });

  return router;
}

module.exports = AccountController;