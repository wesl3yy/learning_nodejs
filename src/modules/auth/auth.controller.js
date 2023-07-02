import { Router } from "express"
import { AuthServices } from "./auth.services";
import { AuthMiddleware } from "./auth.controller.middleware";
import { UserServices } from "../user/user.services";
import { HttpParamValidators } from "../../common/http_param_validator";

/**
 * @param {AuthServices} authServices 
 * @param {UserServices} userServices 
 */
export function AuthController(authServices, userServices) {
  const router = Router();

  router.post('/register', async (req, res) => {
    const username = HttpParamValidators.MustBeString(req.body, 'username', 2);
    const password = HttpParamValidators.MustBeString(req.body, 'password', 6);
    const email = HttpParamValidators.MustBeString(req.body, 'email', 4);
    const doc = await authServices.register(username, password, email);
    res.json(doc);
  })

  router.post('/login', async (req, res) => {
    const username = HttpParamValidators.MustBeString(req.body, 'username', 2);
    const password = HttpParamValidators.MustBeString(req.body, 'password', 6);
    const doc = await authServices.login(username, password);
    res.json(doc);
  })

  router.post('/forgot-password', async (req, res) => {
    const email = HttpParamValidators.MustBeString(req.body, 'email', 4);
    const doc = await authServices.forgotPassword(email);
    res.json(doc);
  })

  router.use(AuthMiddleware(userServices));
  router.get('/me', async (req, res) => {
    const { user } = req;
    res.json(user);
  })

  router.post('/change-password', async (req, res) => {
    const password = HttpParamValidators.MustBeString(req.body, 'password', 6);
    const { user } = req;
    const doc = await authServices.changePassword(user, password);
    res.json(doc);
  })

  return router;
}