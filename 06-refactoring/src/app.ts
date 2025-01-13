import express, { Express } from "express";
import { getCoursesRouter, getTestsRouter } from "./routes";
import { db } from "./db";

const app: Express = express();
export const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const coursesRouter = getCoursesRouter(db);
const testsRouter = getTestsRouter(db);

app.use("/courses", coursesRouter);
app.use("/__test__", testsRouter);

export default app;
