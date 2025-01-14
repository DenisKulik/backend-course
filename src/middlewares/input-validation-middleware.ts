import { validationResult } from "express-validator";
import { HttpStatuses } from "../types";
import { NextFunction } from "express";
import { Request, Response } from "express";

export const inputValidationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.sendStatus(HttpStatuses.BAD_REQUEST).send({ errors: errors.array() });
    return;
  } else {
    next();
  }
};
