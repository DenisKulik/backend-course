import {
  CourseCreateModel,
  CourseUpdateModel,
  CourseViewModel,
} from "../models";
import { Course } from "../types";
import { CoursesRepository, ICoursesRepository } from "../repositories";

export interface ICoursesService {
  findCourses(
    title?: string,
    sortBy?: string,
    direction?: string,
  ): Promise<CourseViewModel[]>;
  findCourseById(id: number): Promise<CourseViewModel | null>;
  createCourse(course: CourseCreateModel): Promise<CourseViewModel>;
  updateCourse(
    id: number,
    course: CourseUpdateModel,
  ): Promise<CourseViewModel | null>;
  deleteCourse(id: number): Promise<boolean>;
}

export class CoursesService implements ICoursesService {
  private repository: ICoursesRepository = new CoursesRepository();

  async findCourses(
    title?: string,
    sortBy?: string,
    direction?: string,
  ): Promise<CourseViewModel[]> {
    return this.repository.findCourses(title, sortBy, direction);
  }

  async findCourseById(id: number): Promise<CourseViewModel | null> {
    return this.repository.findCourseById(id);
  }

  async createCourse(course: CourseCreateModel): Promise<CourseViewModel> {
    const createdCourse: Course = {
      id: new Date().getTime(),
      title: course.title,
      price: course.price,
      studentsCount: 0,
    };

    return this.repository.createCourse(createdCourse);
  }

  async updateCourse(
    id: number,
    course: CourseUpdateModel,
  ): Promise<CourseViewModel | null> {
    return this.repository.updateCourse(id, course);
  }

  async deleteCourse(id: number): Promise<boolean> {
    return this.repository.deleteCourse(id);
  }
}
