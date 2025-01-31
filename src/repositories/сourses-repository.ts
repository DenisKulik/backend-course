import { getCourseViewModel } from "../utils";
import { CourseUpdateModel, CourseViewModel } from "../models";
import { Course } from "../types";
import { Sort, UpdateResult } from "mongodb";
import { CourseModel } from "./db";

export interface ICoursesRepository {
  findCourses(
    title?: string,
    sortBy?: string,
    direction?: string,
  ): Promise<CourseViewModel[]>;
  findCourseById(id: number): Promise<CourseViewModel | null>;
  createCourse(course: Omit<Course, "_id">): Promise<CourseViewModel>;
  updateCourse(
    id: number,
    course: CourseUpdateModel,
  ): Promise<CourseViewModel | null>;
  deleteCourse(id: number): Promise<boolean>;
}

export class CoursesRepository implements ICoursesRepository {
  async findCourses(
    title?: string,
    sortBy?: string,
    direction?: string,
  ): Promise<CourseViewModel[]> {
    const filter: any = {};
    const sort: Sort = {};

    if (title) {
      filter.title = title;
    }
    if (sortBy) {
      sort[sortBy] = direction === "asc" ? 1 : -1;
    }

    const courses = await CourseModel.find(filter).sort(sort).lean();
    return courses.map((dbCourse) => getCourseViewModel(dbCourse));
  }

  async findCourseById(id: number): Promise<CourseViewModel | null> {
    const foundCourse: Course | null = await CourseModel.findOne({ id });
    return foundCourse ? getCourseViewModel(foundCourse) : null;
  }

  async createCourse(course: Omit<Course, "_id">): Promise<CourseViewModel> {
    await CourseModel.create(course);
    const createdCourse: CourseViewModel | null = await CourseModel.findOne({
      id: course.id,
    });
    return getCourseViewModel(createdCourse as Course);
  }

  async updateCourse(
    id: number,
    course: CourseUpdateModel,
  ): Promise<CourseViewModel | null> {
    const result: UpdateResult<Course> = await CourseModel.updateOne(
      { id },
      { $set: course },
    );

    if (result.matchedCount === 0) {
      return null;
    }

    const updatedCourse: CourseViewModel | null = await CourseModel.findOne({
      id,
    });

    return getCourseViewModel(updatedCourse as Course);
  }

  async deleteCourse(id: number): Promise<boolean> {
    const result = await CourseModel.deleteOne({ id });

    return result.deletedCount !== 0;
  }
}
