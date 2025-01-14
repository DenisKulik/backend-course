import { ValidationError } from "express-validator";
import {
  CourseCreateModel,
  CoursesQueryModel,
  CourseUpdateModel,
  CourseURIParamsModel,
  CourseViewModel,
} from "../models";
import { Router, Response } from "express";
import {
  ErrorResponse,
  HttpStatuses,
  RequestBody,
  RequestBodyParams,
  RequestParams,
  RequestQuery,
} from "../types";
import { CoursesRepository, ICoursesRepository } from "../repositories";
import { courseValidator } from "../utils";
import { inputValidationMiddleware } from "../middlewares";

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
      res: Response<CourseViewModel | ErrorResponse>,
    ) => {
      const foundCourse = repository.findCourseById(req.params.id);

      if (!foundCourse) {
        res
          .sendStatus(HttpStatuses.NOT_FOUND)
          .send({ message: "Course not found" });
        return;
      }

      res.status(HttpStatuses.OK).json(foundCourse);
    },
  );

  router.post(
    "/",
    courseValidator,
    inputValidationMiddleware,
    (
      req: RequestBody<CourseCreateModel>,
      res: Response<CourseViewModel | { errors: ValidationError[] }>,
    ) => {
      const createdCourse = repository.createCourse(req.body);
      res.status(HttpStatuses.CREATED).json(createdCourse);
    },
  );

  router.delete(
    "/:id",
    (
      req: RequestParams<CourseURIParamsModel>,
      res: Response<ErrorResponse | undefined>,
    ) => {
      const isDeletedCourse = repository.deleteCourse(req.params.id);

      if (!isDeletedCourse) {
        res
          .sendStatus(HttpStatuses.NOT_FOUND)
          .send({ message: "Course not found" });
        return;
      }

      res.sendStatus(HttpStatuses.NO_CONTENT);
    },
  );

  router.put(
    "/:id",
    courseValidator,
    inputValidationMiddleware,
    (
      req: RequestBodyParams<CourseUpdateModel, CourseURIParamsModel>,
      res: Response<
        CourseViewModel | { errors: ValidationError[] } | ErrorResponse
      >,
    ) => {
      const updatedCourse = repository.updateCourse(req.params.id, req.body);

      if (!updatedCourse) {
        res
          .sendStatus(HttpStatuses.NOT_FOUND)
          .send({ message: "Course not found" });
        return;
      }

      res.status(HttpStatuses.CREATED).json(updatedCourse);
    },
  );

  return router;
};
