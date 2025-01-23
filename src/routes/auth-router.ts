import { Router } from "express";
import { JwtService, UsersService } from "../domain";
import { HttpStatuses, UserDBType } from "../types";

export const getAuthRouter = () => {
  const router = Router();
  const userService = new UsersService();
  const jwtService = new JwtService();

  router.post("/register", async (req, res) => {
    const user: UserDBType = await userService.createUser(
      req.body.login,
      req.body.email,
      req.body.password,
    );

    if (user) {
      res.status(HttpStatuses.CREATED).send({ message: "Success" });
    } else {
      res.sendStatus(HttpStatuses.BAD_REQUEST).send({ message: "Bad request" });
    }
  });

  router.post("/login", async (req, res) => {
    const user = await userService.checkCredentials(
      req.body.loginOrEmail,
      req.body.password,
    );

    if (user) {
      // const token = await jwtService.createJWT(user);
      res.status(HttpStatuses.CREATED).send({ message: "Success" });
    } else {
      res
        .sendStatus(HttpStatuses.UNAUTHORIZED)
        .send({ message: "Unauthorized" });
    }
  });

  return router;
};
