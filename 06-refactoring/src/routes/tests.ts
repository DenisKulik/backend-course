import express, { Request, Response } from "express";
import { Db, HttpStatuses } from "../types";

export const getTestsRouter = (db: Db) => {
  const router = express.Router();

  router.delete("/data", (req: Request, res: Response) => {
    db.courses = [];
    res.sendStatus(HttpStatuses.NO_CONTENT);
  });

  return router;
};
