import {
  CourseCreateModel,
  CoursesQueryModel,
  CourseUpdateModel,
  CourseURIParamsModel,
  CourseViewModel,
} from "../models";
import { Router, Response } from "express";
import {
  HttpStatuses,
  RequestBody,
  RequestBodyParams,
  RequestParams,
  RequestQuery,
} from "../types";
import { CoursesRepository, ICoursesRepository } from "../repositories";

export const getCoursesRouter = () => {
  const router = Router();
  const repository: ICoursesRepository = new CoursesRepository();

  router.get(
    "/",
    (
      req: RequestQuery<CoursesQueryModel>,
      res: Response<CourseViewModel[]>,
    ) => {
      const foundCourses = repository.findCourses(req.query.title);
      res.json(foundCourses);
    },
  );

  router.get(
    "/:id",
    (
      req: RequestParams<CourseURIParamsModel>,
      res: Response<CourseViewModel | string>,
    ) => {
      const foundCourse = repository.findCourseById(req.params.id);

      if (!foundCourse) {
        res.sendStatus(HttpStatuses.NOT_FOUND).send("Course not found");
        return;
      }

      res.status(HttpStatuses.OK).json(foundCourse);
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

      const createdCourse = repository.createCourse(req.body);
      res.status(HttpStatuses.CREATED).json(createdCourse);
    },
  );

  router.delete(
    "/:id",
    (req: RequestParams<CourseURIParamsModel>, res: Response) => {
      const isDeletedCourse = repository.deleteCourse(req.params.id);

      if (!isDeletedCourse) {
        res.sendStatus(HttpStatuses.NOT_FOUND).send("Course not found");
        return;
      }

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

      const updatedCourse = repository.updateCourse(req.params.id, req.body);

      if (!updatedCourse) {
        res.sendStatus(HttpStatuses.NOT_FOUND).send("Course not found");
        return;
      }

      res.status(HttpStatuses.CREATED).json(updatedCourse);
    },
  );

  return router;
};
