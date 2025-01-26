import { NextFunction, Request, Response } from "express";
import { HttpStatuses } from "../types";
import { JwtService } from "../application";
import { UsersService } from "../domain";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!req.headers.authorization) {
    res.sendStatus(HttpStatuses.UNAUTHORIZED);
    return;
  }

  const jwtService = new JwtService();

  const token = req.headers.authorization.split(" ")[1]; // Bearer token
  const userId = await jwtService.getUserIdByToken(token);

  if (userId) {
    const usersService = new UsersService();
    const user = await usersService.findUserById(userId);
    req.user = user || undefined;
    return next();
  }

  res.sendStatus(HttpStatuses.UNAUTHORIZED);
};
