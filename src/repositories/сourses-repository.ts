import { getCourseViewModel } from "../utils";
import {
  CourseCreateModel,
  CourseUpdateModel,
  CourseViewModel,
} from "../models";
import { Course } from "../types";
import { productsCollection } from "./db";

export interface ICoursesRepository {
  findCourses(title?: string): Promise<CourseViewModel[]>;
  findCourseById(id: number): Promise<CourseViewModel | null>;
  createCourse(course: CourseCreateModel): Promise<CourseViewModel>;
  updateCourse(
    id: number,
    course: CourseUpdateModel,
  ): Promise<CourseViewModel | null>;
  deleteCourse(id: number): Promise<boolean>;
}

export class CoursesRepository implements ICoursesRepository {
  async findCourses(title?: string): Promise<CourseViewModel[]> {
    const filter: any = {};
    if (title) {
      filter.title = title;
    }

    const courses = await productsCollection.find(filter).toArray();
    return courses.map((dbCourse) => getCourseViewModel(dbCourse));
  }

  async findCourseById(id: number): Promise<CourseViewModel | null> {
    const foundCourse: Course | null = await productsCollection.findOne({ id });
    return foundCourse ? getCourseViewModel(foundCourse) : null;
  }

  async createCourse(course: CourseCreateModel): Promise<CourseViewModel> {
    const createdCourse: Course = {
      id: new Date().getTime(),
      title: course.title,
      price: course.price,
      studentsCount: 0,
    };

    await productsCollection.insertOne(createdCourse);
    return getCourseViewModel(createdCourse);
  }

  async updateCourse(
    id: number,
    course: CourseUpdateModel,
  ): Promise<CourseViewModel | null> {
    const result = await productsCollection.updateOne({ id }, { $set: course });

    if (result.matchedCount === 0) {
      return null;
    }

    const updatedCourse: CourseViewModel | null =
      await productsCollection.findOne({ id });

    return getCourseViewModel(updatedCourse as Course);
  }

  async deleteCourse(id: number): Promise<boolean> {
    const result = await productsCollection.deleteOne({ id });

    return result.deletedCount !== 0;
  }
}
