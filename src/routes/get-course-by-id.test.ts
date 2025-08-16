import { test, expect } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { makeCourse } from "../tests/factories/make-course.ts";

test("Get course by Id ", async () => {
  await server.ready();

  const course = await makeCourse()

  const response = await request(server.server)
    .get(`/courses/${course.id}`)

  expect(response.status).toEqual(200);
  expect(response.body).toEqual({
    course: { 
      id: expect.any(String),
      title: expect.any(String),
      description: null,
    },
  });
});

test("return 404 for course not found", async () => {
  await server.ready();

  const response = await request(server.server).get(
    `/courses/f47ac10b-58cc-4372-a567-0e02b2c3d479`
  );

  expect(response.status).toEqual(404);
});
