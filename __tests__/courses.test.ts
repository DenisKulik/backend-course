import request from "supertest";

import app from "../src/app";
import { CourseCreateModel, CourseUpdateModel } from "../src/models";
import { HttpStatuses } from "../src/types";

describe("courses", () => {
  beforeAll(async () => {
    await request(app).delete("/__test__/data");
  });

  it("should return all courses", async () => {
    const res = await request(app).get("/courses");
    expect(res.status).toEqual(HttpStatuses.OK);
    expect(res.body.length).toBe(0);
  });

  it("shouldn't create a course with incorrect data", async () => {
    const res = await request(app).post("/courses").send({ title: "" });
    const db = await request(app).get("/courses");
    expect(res.status).toEqual(HttpStatuses.BAD_REQUEST);
    expect(db.body.length).toBe(0);
  });

  it("should create a course with correct data", async () => {
    const course: CourseCreateModel = { title: "test" };
    const res = await request(app).post("/courses").send(course);
    const db = await request(app).get("/courses");
    expect(res.status).toEqual(HttpStatuses.CREATED);
    expect(res.body.title).toEqual("test");
    expect(db.body.length).toBe(1);
  });

  it("should update a course", async () => {
    const db = await request(app).get("/courses");
    const courseId = db.body[0].id;
    const course: CourseUpdateModel = { title: "test_updated" };
    const res = await request(app).put(`/courses/${courseId}`).send(course);
    expect(res.status).toEqual(HttpStatuses.CREATED);
    expect(res.body.title).toEqual("test_updated");
  });

  it("shouldn't update a course with incorrect data", async () => {
    const db = await request(app).get("/courses");
    const courseId = db.body[0].id;
    const course: CourseUpdateModel = { title: " " };
    const res = await request(app).put(`/courses/${courseId}`).send(course);
    expect(res.status).toEqual(HttpStatuses.BAD_REQUEST);
  });

  it("should delete a course", async () => {
    const db = await request(app).get("/courses");
    const courseId = db.body[0].id;
    const res = await request(app).delete(`/courses/${courseId}`);
    expect(res.status).toEqual(HttpStatuses.NO_CONTENT);
    const dbAfterDelete = await request(app).get("/courses");
    expect(dbAfterDelete.body.length).toBe(0);
  });
});
