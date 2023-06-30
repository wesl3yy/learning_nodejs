import { Router } from "express"
import { AuthServices } from "./auth.services";
import { MailServices } from "../../shared/mail.services";
import { authMiddleware } from "./auth.middleware";
import { UserServices } from "../user/user.services";

/**
 * @param {AuthServices} authServices 
 * @param {UserServices} userServices 
 */
export function AuthController(authServices, userServices) {
  const router = Router();

  router.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    const doc = await authServices.register(username, password, email);
    res.json(doc);
  })

  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const doc = await authServices.login(username, password);
    res.json(doc);
  })

  router.use(authMiddleware(userServices));
  router.get('/me', async (req, res) => {
    const { user } = req;
    res.json(user);
  })

  return router;
}