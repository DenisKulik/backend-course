import {
  CourseCreateModel,
  CoursesQueryModel,
  CourseUpdateModel,
  CourseURIParamsModel,
  CourseViewModel,
} from "../models";
import express, { Express, Response } from "express";
import { getCourseViewModel } from "../utils";
import {
  Course,
  Db,
  HttpStatuses,
  RequestBody,
  RequestBodyParams,
  RequestParams,
  RequestQuery,
} from "../types";

export const routerCourses = express.Router();

export const getCoursesRouter = (db: Db) => {
  const router = express.Router();

  router.get(
    "/",
    (
      req: RequestQuery<CoursesQueryModel>,
      res: Response<CourseViewModel[]>,
    ) => {
      let foundCourses = db.courses;

      if (req.query.title) {
        foundCourses = foundCourses.filter((c) => {
          return c.title.includes(req.query.title!);
        });
      }

      res.json(foundCourses.map((dbCourse) => getCourseViewModel(dbCourse)));
    },
  );

  router.get(
    "/:id",
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

  router.post(
    "/",
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

  router.delete(
    "/:id",
    (req: RequestParams<CourseURIParamsModel>, res: Response) => {
      const foundCourseIdx = db.courses.findIndex(
        (c) => c.id === +req.params.id,
      );

      if (foundCourseIdx === -1) {
        res.sendStatus(HttpStatuses.NOT_FOUND).send("Course not found");
        return;
      }

      db.courses.splice(foundCourseIdx, 1);
      res.sendStatus(HttpStatuses.NO_CONTENT);
    },
  );

  router.put(
    "/:id",
    (
      req: RequestBodyParams<CourseUpdateModel, CourseURIParamsModel>,
      res: Response<CourseViewModel | string>,
    ) => {
      if (!req.body.title || !req.body.title.trim()) {
        res.sendStatus(HttpStatuses.BAD_REQUEST).send("Title is required");
        return;
      }

      const foundCourseIdx = db.courses.findIndex(
        (c) => c.id === +req.params.id,
      );

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

  return router;
};
