import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses, enrollments } from "../database/schema.ts";
import { z } from "zod/v4";
import { ilike, asc, and, SQL, eq, count } from "drizzle-orm";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { checkUserRole } from "./hooks/check-user-role.ts";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get("/courses", {
    preHandler: [
      checkRequestJWT,
      checkUserRole('manager'),
    ],
    schema: {
      tags: ['courses'],
      summary: 'Get all Courses',
      description: "Return all courses with properties",
      querystring: z.object({
        search: z.string().optional(),
        orderBy: z.enum(['id', 'title']).optional().default('title'),
        page: z.coerce.number().optional().default(1),
      }),
      response: {
        200: z.object({
          courses: z.array(
            z.object({
              id: z.uuid(),
              title: z.string(),
              enrollments: z.number(),
            })
          ),
          total: z.number(),
        })
      }
    }
  }, async (request, reply) => {
    const { search, orderBy, page } = request.query;

    const conditions: SQL[] = []

    if(search) { 
      conditions.push(ilike(courses.title, `%${search}%`))
    }

    const [result, total] = await Promise.all([
      db.select({
        id: courses.id,
        title: courses.title,
        enrollments: count(enrollments.courseId)
      }).from(courses)
      .leftJoin(enrollments, eq(enrollments.courseId, courses.id))
      .groupBy(courses.id)
      .orderBy(asc(courses[orderBy]))
      .where(and(...conditions))
      .limit(10)
      .offset((page - 1) * 2),
      db.$count(
        courses,
        and(...conditions)
      ),
    ])
  
    return reply.send({ courses: result, total })
  });
}