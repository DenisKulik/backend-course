import express, { Express, Request, Response } from "express";

const app: Express = express();
const port = 3000;

const jsonBodyMiddleware = express.json();
app.use(jsonBodyMiddleware);

enum HttpStatuses {
  OK = 200,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  CREATED = 201,
  NO_CONTENT = 204,
}

const db = {
  courses: [
    { id: 1, title: "react" },
    { id: 2, title: "angular" },
    { id: 3, title: "vue" },
  ],
};

app.get("/courses", (req: Request, res: Response) => {
  let foundCoursesQuery = db.courses;

  if (req.query.title) {
    foundCoursesQuery = foundCoursesQuery.filter((c) => {
      return c.title.includes(req.query.title as string);
    });
  }

  res.json(foundCoursesQuery);
});
app.get("/courses/:id", (req: Request, res: Response) => {
  const foundCourse = db.courses.find((c) => c.id === +req.params.id);

  if (!foundCourse) {
    res.sendStatus(HttpStatuses.NOT_FOUND).send("Course not found");
    return;
  }

  res.json(foundCourse);
});
app.post("/courses", (req: Request, res: Response) => {
  if (!req.body.title || !req.body.title.trim()) {
    res.sendStatus(HttpStatuses.BAD_REQUEST).send("Title is required");
    return;
  }

  const createdCourse = {
    id: new Date().getTime(),
    title: req.body.title,
  };
  db.courses.push(createdCourse);
  res.status(HttpStatuses.CREATED).json(createdCourse);
});
app.delete("/courses/:id", (req: Request, res: Response) => {
  const foundCourseIdx = db.courses.findIndex((c) => c.id === +req.params.id);

  if (foundCourseIdx === -1) {
    res.sendStatus(HttpStatuses.NOT_FOUND).send("Course not found");
    return;
  }

  db.courses.splice(foundCourseIdx, 1);
  res.sendStatus(HttpStatuses.NO_CONTENT);
});
app.put("/courses/:id", (req: Request, res: Response) => {
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
    id: db.courses[foundCourseIdx].id,
    ...req.body,
  };
  db.courses[foundCourseIdx] = updatedCourse;
  res.status(HttpStatuses.CREATED).json(updatedCourse);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
