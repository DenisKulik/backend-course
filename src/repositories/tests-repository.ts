export interface ITestsRepository {
  clearCoursesDb(): void;
}

export class TestsRepository implements ITestsRepository {
  clearCoursesDb(): void {
    // this.db.courses = [];
  }
}
