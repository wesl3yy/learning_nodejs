require("dotenv").config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
// const moment = require("moment");
// const jwt_token = require("../authenticate/authen");
const express = require('express');
const { User, Type } = require("../../database/model/models.js");

function AccountController(accountServices) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    const { username, password, type } = req.body;
    // const accountType = await Type.findOne({ code: type });
    // if (!accountType) {
    //   return res.status(404).json({
    //     message: 'Account type not found'
    //   });
    // }
    try {
      const account = await accountServices.create(username, password);
      res.status(200).json(account);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

  return router;
}

module.exports = AccountController;