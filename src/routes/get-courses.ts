import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import { z } from "zod/v4";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get("/courses", {
    schema: {
      tags: ['courses'],
      summary: 'Get all Courses',
      description: "Return all courses with properties",
      response: {
        200: z.object({
          courses: z.array(
            z.object({
              id: z.uuid(),
              title: z.string(),
            })
          )
        })
      }
    }
  }, async (request, reply) => {
    const result = await db.select({
      id: courses.id,
      title: courses.title,
    }).from(courses)
  
    return reply.send({ courses: result })
  });
}