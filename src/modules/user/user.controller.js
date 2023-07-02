import { Router } from "express";
import { UserServices } from "./user.services";
import { AuthMiddleware } from "../auth/auth.controller.middleware";
import { HttpParamValidators } from "../../common/http_param_validator";
import { Gender } from "../../const/gender";
/**
 * @param {UserServices} userServices 
 */
export function UserController(userServices) {
  const router = Router();
  const genders = Object.values(Gender);

  router.use(AuthMiddleware(userServices));
  router.put('/', async (req, res) => {
    const params = {};
    for (const k in Object.keys(req.body)) {
      if (k === "fullName" || k === "address") params[k] = HttpParamValidators.MustBeString(req.body, k, 2);
      if (k === "dob") params[k] = HttpParamValidators.MustBeString(req.body, k, 6);
      if (k === "genders") params[k] = HttpParamValidators.MustBeOneOf(req.body, k, genders);
    }
    const { user } = req;
    const doc = { ...user, ...params };
    await userServices.update(doc);
    res.json(doc);
  });

  return router;
}