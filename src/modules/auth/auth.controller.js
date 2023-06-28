import express from 'express';
import { authMiddleware } from './auth.middleware.js';
import { configServices } from '../../config.js';
import { GeneralError, GeneralMessage } from '../../common/general.js';
import { AccountServices, UserTokenService } from './auth.services.js';

/**
 * @param {AccountServices} accountServices 
 * @param {UserTokenService} userTokenService 
 */
export function AccountController(accountServices, userTokenService) {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
      const account = await accountServices.create(username, password, email);
      if (account.message == GeneralError.VerifyAccountError) {
        return res.status(400).json({ message: GeneralError.VerifyAccountError });
      }
      const accountToken = await userTokenService.create(account._id);
      if (accountToken.message == GeneralError.VerifyAccountError){
        return res.status(400).json({ message: GeneralError.InvalidError});
      } else {
        const send_email = await userTokenService.sendEmail(accountToken.token, account.email);
      }
      return res.status(200).json({ message: GeneralMessage.EmailSent });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  });

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await accountServices.findOne(username);
      if (user.message == GeneralError.NotFound) {
        return res.status(400).json(user);
      }
      const expiresIn = configServices.getJWTConfig().expiresIn;
      const token = await accountServices.login(user, password, expiresIn);
      if (token.message == GeneralError.WrongPassword) {
        return res.status(403).json(token);
      }
      return res.status(200).json(token);
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  });

  router.use(authMiddleware);
  router.put('/user', async (req, res) => {
    const { fullname, dob, phone, gender, address } = req.body;
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
      const options = { new: true, select: '-password' };
      const updateUser = await accountServices.findUserAndUpdate(filter, update, options);
      if (updateUser.message == Error.NotFound) {
        return res.status(403).json(updateUser);
      }
      return res.status(200).send(updateUser);
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  });

  router.use(authMiddleware);
  router.get('/user', async (req, res) => {
    const userToken = req.headers.authorization;
    if (userToken) {
      const token = userToken.split(" ");
      console.log(token)
    }
    try {
      const user = await accountServices.findOne(username);
      if (user.message == GeneralError.NotFound) {
        return res.status(400).json(user);
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(400).json({ message: error.message })
    }
  });

  router.use(authMiddleware);
  router.put('/user/reset_password', async (req, res) => {
    const username = req.params.username;
    try {
      const { password, confirm_password } = req.body;
      const user = await accountServices.findOne(username);
      if (user.message == GeneralError.NotFound) {
        return res.status(400).json(user);
      }
      const passwordMatch = await accountServices.compare(password, user.password);
      if (passwordMatch) {
        return res.status(400).json({ message: passwordMatch.message })
      }
      if (password == confirm_password) {
        const update = password;
        const filter = {
          username: username,
          _id: req.user.id
        }
        const options = { new: false }
        const updateUser = await accountServices.findUserAndUpdate(filter, update, options);
        return res.status(201).json({ message: GeneralMessage.ChangePasswordSuccess });
      } else {
        return res.status(400).json({ message: GeneralError.NotALikePassword });
      }
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  });

  return router;
}