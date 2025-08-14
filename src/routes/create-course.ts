import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import { z } from "zod/v4";

export const createCourseRoute: FastifyPluginAsyncZod = async (server) => {
  server.post("/courses", {
    schema: {
      tags: ['courses'],
      summary: 'Create a course',
      description: 'This route receives a title for a course and storage in database',
      body: z.object({
        title: z.string().min(5, 'Minimum 5 characters is required!'),
      }),
      response: { 
        201: z.object({
          courseId: z.uuid(),
        }).describe("Course Created")
      }
    }
  }, async (request, reply) => { 
    const courseTitle = request.body.title;

    const result = await db
      .insert(courses)
      .values({ title: courseTitle })
      .returning()

    return reply.status(201).send({ courseId: result[0].id })
  })
}