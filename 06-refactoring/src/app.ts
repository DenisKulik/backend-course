import express, { Express, Request, Response } from "express";
import {
  Course,
  Db,
  HttpStatuses,
  RequestBody,
  RequestParams,
  RequestQuery,
  RequestBodyParams,
} from "./app.types";
import {
  CourseCreateModel,
  CourseUpdateModel,
  CoursesQueryModel,
  CourseViewModel,
  CourseURIParamsModel,
} from "./models";

const app: Express = express();
const port = 3000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

const db: Db = {
  courses: [
    { id: 1, title: "react", studentsCount: 30 },
    { id: 2, title: "angular", studentsCount: 10 },
    { id: 3, title: "vue", studentsCount: 20 },
  ],
};

const getCourseViewModel = (dbCourse: Course): CourseViewModel => ({
  id: dbCourse.id,
  title: dbCourse.title,
});

app.get(
  "/courses",
  (req: RequestQuery<CoursesQueryModel>, res: Response<CourseViewModel[]>) => {
    let foundCourses = db.courses;

    if (req.query.title) {
      foundCourses = foundCourses.filter((c) => {
        return c.title.includes(req.query.title!);
      });
    }

    res.json(foundCourses.map((dbCourse) => getCourseViewModel(dbCourse)));
  },
);

app.get(
  "/courses/:id",
  (
    req: RequestParams<CourseURIParamsModel>,
    res: Response<CourseViewModel | string>,
  ) => {
    const foundCourse = db.courses.find((c) => c.id === +req.params.id);

    if (!foundCourse) {
      res.sendStatus(HttpStatuses.NOT_FOUND).send("Course not found");
      return;
    }

    res.status(HttpStatuses.OK).json(getCourseViewModel(foundCourse));
  },
);

app.post(
  "/courses",
  (
    req: RequestBody<CourseCreateModel>,
    res: Response<CourseViewModel | string>,
  ) => {
    if (!req.body.title || !req.body.title.trim()) {
      res.sendStatus(HttpStatuses.BAD_REQUEST).send("Title is required");
      return;
    }

    const createdCourse: Course = {
      id: new Date().getTime(),
      title: req.body.title,
      studentsCount: 0,
    };

    db.courses.push(createdCourse);
    res.status(HttpStatuses.CREATED).json(getCourseViewModel(createdCourse));
  },
);

app.delete(
  "/courses/:id",
  (req: RequestParams<CourseURIParamsModel>, res: Response) => {
    const foundCourseIdx = db.courses.findIndex((c) => c.id === +req.params.id);

    if (foundCourseIdx === -1) {
      res.sendStatus(HttpStatuses.NOT_FOUND).send("Course not found");
      return;
    }

    db.courses.splice(foundCourseIdx, 1);
    res.sendStatus(HttpStatuses.NO_CONTENT);
  },
);

app.put(
  "/courses/:id",
  (
    req: RequestBodyParams<CourseUpdateModel, CourseURIParamsModel>,
    res: Response<CourseViewModel | string>,
  ) => {
    if (!req.body.title || !req.body.title.trim()) {
      res.sendStatus(HttpStatuses.BAD_REQUEST).send("Title is required");
      return;
    }

    const foundCourseIdx = db.courses.findIndex((c) => c.id === +req.params.id);

    if (foundCourseIdx === -1) {
      res.sendStatus(HttpStatuses.NOT_FOUND).send("Course not found");
      return;
    }

    const updatedCourse = {
      ...db.courses[foundCourseIdx],
      ...req.body,
    };

    db.courses[foundCourseIdx] = updatedCourse;
    res.status(HttpStatuses.CREATED).json(getCourseViewModel(updatedCourse));
  },
);

app.delete("/__test__/data", (req: Request, res: Response) => {
  db.courses = [];
  res.sendStatus(HttpStatuses.NO_CONTENT);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
