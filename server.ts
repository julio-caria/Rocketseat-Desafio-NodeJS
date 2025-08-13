import fastify from "fastify";
import crypto from "node:crypto";

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
});

const courses = [ 
  {
    id: 1,
    title: "Node.js",
  },
  {
    id: 2,
    title: "React.js",
  },
  {
    id: 3,
    title: "React Native",
  },
]

server.get("/courses", () => {
  return { courses }
});

server.get('/courses/:id', (request, reply) => {
  type Params = { 
    id: string;
  }

  const params = request.params as Params;
  const courseId = params.id

  const course = courses.find(course => course.id === courseId);

  if(course) {
    return reply.send({ course });
  }

  return reply.status(404).send("Course not found");
})

server.post('/courses', (request, reply) => {
  type Body = { 
    title: string;
  }

  const courseId = crypto.randomUUID();
  const body = request.body as Body;
  const courseTitle = body.title;
  
  if (!courseTitle) {
    return reply.status(400).send("Course title is required");
  }
  
  courses.push({ id: courseId, title: courseTitle });

  return reply.status(201).send({
    id: courseId,
  });
})

server.listen({ port: 3333}).then(() => {
  console.log("HTTP Server is running!");
})
