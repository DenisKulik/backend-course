import express, { Express } from "express";
import { getCoursesRouter, getTestsRouter } from "./routes";

const app: Express = express();

export const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const coursesRouter = getCoursesRouter();
const testsRouter = getTestsRouter();

app.use("/courses", coursesRouter);
app.use("/__test__", testsRouter);

export default app;
