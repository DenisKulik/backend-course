import { CourseViewModel } from "../models";
import { Course } from "../types";

export const getCourseViewModel = (dbCourse: Course): CourseViewModel => ({
  id: dbCourse.id,
  title: dbCourse.title,
  price: dbCourse.price,
});
