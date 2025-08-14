import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get("/courses/:id", {
    schema: { 
      tags: ['courses'],
      summary: "Get a course by ID",
      description: "This route receives a course ID as a parameter and returns the properties of that course.",
      params: z.object({
        id: z.uuid(),
      }),
      response: {
        200: z.object({
          course: z.object({
            id: z.uuid(),
            title: z.string(),
            description: z.string().nullable(), 
          })
        }),
        404: z.null().describe('Course not found'),
      }
    }
  }, async (request, reply) => {
    const courseId = request.params.id

    const result = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))

    if(result.length > 0) {
      return { course: result[0] }
    }
    
    return reply.status(404).send()
  })
}