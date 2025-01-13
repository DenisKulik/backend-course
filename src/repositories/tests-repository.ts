import { db } from "../db";
import { Db } from "../types";

export interface ITestsRepository {
  clearCoursesDb(): void;
}

export class TestsRepository implements ITestsRepository {
  private db: Db = db;

  clearCoursesDb(): void {
    this.db.courses = [];
  }
}
