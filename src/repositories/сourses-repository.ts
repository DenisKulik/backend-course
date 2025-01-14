import { getCourseViewModel } from "../utils";
import { db } from "../db";
import {
  CourseCreateModel,
  CourseUpdateModel,
  CourseViewModel,
} from "../models";
import { Course, Db } from "../types";

export interface ICoursesRepository {
  findCourses(title?: string): CourseViewModel[];
  findCourseById(id: string): CourseViewModel | null;
  createCourse(course: CourseCreateModel): CourseViewModel;
  deleteCourse(id: string): boolean;
  updateCourse(id: string, course: CourseUpdateModel): CourseViewModel | null;
}

export class CoursesRepository implements ICoursesRepository {
  private db: Db = db;

  findCourses(title?: string): CourseViewModel[] {
    let filteredCourses: Course[] = this.db.courses;

    if (title) {
      filteredCourses = filteredCourses.filter((c) => {
        return c.title.includes(title!);
      });
    }

    return filteredCourses.map((dbCourse) => getCourseViewModel(dbCourse));
  }

  findCourseById(id: string): CourseViewModel | null {
    const foundCourse: Course | undefined = this.db.courses.find(
      (c) => c.id === +id,
    );
    return foundCourse ? getCourseViewModel(foundCourse) : null;
  }

  createCourse(course: CourseCreateModel): CourseViewModel {
    const createdCourse: Course = {
      id: new Date().getTime(),
      title: course.title,
      price: course.price,
      studentsCount: 0,
    };

    this.db.courses.push(createdCourse);
    return getCourseViewModel(createdCourse);
  }

  deleteCourse(id: string): boolean {
    const foundCourseIdx = this.db.courses.findIndex((c) => c.id === +id);

    if (foundCourseIdx === -1) {
      return false;
    }

    this.db.courses.splice(foundCourseIdx, 1);
    return true;
  }

  updateCourse(id: string, course: CourseUpdateModel): CourseViewModel | null {
    const foundCourseIdx: number = db.courses.findIndex((c) => c.id === +id);

    if (foundCourseIdx === -1) {
      return null;
    }

    const updatedCourse = {
      ...this.db.courses[foundCourseIdx],
      ...course,
    };

    db.courses[foundCourseIdx] = updatedCourse;
    return getCourseViewModel(updatedCourse);
  }
}
