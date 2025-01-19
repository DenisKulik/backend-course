import { Router, Request, Response } from "express";
import { HttpStatuses } from "../types";
import { ITestsRepository, TestsRepository } from "../repositories";

export const getTestsRouter = () => {
  const router = Router();
  const repository: ITestsRepository = new TestsRepository();

  router.delete("/data", (req: Request, res: Response) => {
    repository.clearCoursesDb();
    res.sendStatus(HttpStatuses.NO_CONTENT);
  });

  return router;
};
