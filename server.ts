import fastify from "fastify";
import { fastifySwagger } from '@fastify/swagger'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'
import { getCourseByIdRoute } from './src/routes/get-course-by-id.ts';
import { getCoursesRoute } from './src/routes/get-courses.ts';
import { createCourseRoute } from './src/routes/create-course.ts';
import scalarAPIReference from "@scalar/fastify-api-reference"

const server = fastify({ 
  logger: { 
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  } 
}).withTypeProvider<ZodTypeProvider>();

if(process.env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Rocketseat - Desafio Node.js',
        version: '1.0.0'
      }
    },
    transform: jsonSchemaTransform
  })

  server.register(scalarAPIReference, {
    routePrefix: '/docs',
    configuration: {
      title: "Docs - Challenge Node.js API Reference",
      theme: "deepSpace",
    }
  })
}

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.register(getCoursesRoute)
server.register(getCourseByIdRoute)
server.register(createCourseRoute)

server.listen({ port: 3333}).then(() => {
  console.log("HTTP Server is running!");
})
