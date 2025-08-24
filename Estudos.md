# Rocketseat - NodeJS

O projeto em questão e voltado para o desenvolvimento de uma API completa, utilizando NodeJS, conhecendo os principais fundamentos, incluindo updates do ecossistema do NodeJS.

## Sumário

1. [Introdução](#rocketseat---nodejs)
2. [Cronograma](#cronograma)
3. [Fundamentos](#fundamentos)
   - [JSON](#json)
   - [API](#api)
   - [Rest](#rest)
   - [URL](#url)
   - [Tipos de dados](#tipos-de-dados)
   - [HTTP Status Code](#http-status-code)
4. [Iniciando o Projeto](#iniciando-o-projeto)
   - [Criando um servidor](#criando-um-servidor)
   - [Instalando o Fastify](#instalando-o-fastify)
   - [Estruturando as rotas](#estruturando-as-rotas)
   - [Chamadas HTTP](#chamadas-http)
5. [Aprimorando o Projeto](#aprimorando-o-projeto)
   - [Instalando e configurando Typescript](#instalando-e-configurando-typescript)
   - [Objeto Logger](#objeto-logger)
6. [Aula 02 - Conceitos](#aula-02---conceitos)
   - [Docker](#docker)
   - [ORM](#orm---object-relational-mapping)
7. [Arquivo docker-compose.yml](#arquivo-docker-composeyml)
8. [Drizzle ORM](#drizzle-orm)
   - [Instalação do Drizzle](#instalação-do-drizzle)
   - [Configuração do Drizzle](#configuração-do-drizzle)
   - [Como criar tabelas com Drizzle](#como-criar-tabelas-com-drizzle)
9. [Validação de dados da requisição](#validação-de-dados-da-requisição)
   - [Diferença entre Serialização e Validação](#diferença-entre-serialização-e-validação)
10. [Documentação](#documentação)
    - [Swagger UI](#alternativa-para-o-swaggerui)
    - [Scalar API Reference](#alternativa-para-o-swaggerui)
    - [Restringindo acesso às docs](#restringindo-o-acesso-as-docs)
11. [Query Params](#query-params)
12. [Paginação](#paginação)
    - [Offset Pagination](#offset-pagination)
    - [Cursor-based Pagination](#cursor-based-pagination)
    - [Comparação Prática](#comparação-prática)
    - [Quando usar cada um?](#quando-usar-cada-um)
13. [Testes Automatizados](#testes-automatizados)

## Cronograma

1. Aula 01 - Fundamentos de API, Status Code, NodeJS.
2. Aula 02 - Funcionalidades essenciais para o sistema, CRUD e estrutura de banco, Docker, Postgres.
3. Aula 03 - Testes Automatizados
4. Aula 04 - Deploy do Projeto, finalização

## Fundamentos

- JSON
- API
- Rest
- URL
- Tipos de dados
- HTTP Status Code

> SSR - Server-Side Rendering: Back-end retornava o Front com a resposta da requisição

Durante muito tempo houve dificuldade em se comunicar na aplicacao, isso por conta da forma como os dados poderiam ser retornados e por quem solicitava esses dados. Isso contempla o retorno em XML (Protocolo SOAP), HTML. Contudo, surgiu o formato JSON (Javascript Object Notation)

```json
[
  {
    "id": 1,
    "nome": "Diego Fernandes"
  }
]
```

> Protocolo SOAP

## Metodos HTTP

- `GET`: Buscar informações de uma entidade
- `POST`: Solicitar criacao de alguma informação em nosso banco de dados
- `PUT`: Atualizar todas as informações de uma entidade
- `DELETE`: Excluir uma informação do nosso banco de dados
- `PATCH`: Atualizar uma unica informação da nossa entidade
- `HEAD`: Utilizado para identificar se o recurso existe, contudo retorna somente um "boolean"

### Identificacao de uma URL

`https://api.meuapp.com/users/32?posts=true`

- `https` -> Protocolo
- `api` -> Subdominio
- `meuapp.com` -> dominio
- `users` -> Recurso
- `32` -> Parametros de rota (Sempre Obrigatorio)
- `?posts=true` -> parametros de busca (search/query params) - Opcional

## Tipos de Dados

`GET localhost:3333/users/1/posts?search=node`

- `Route Param`: Utilizado para identificacao de recursos, sendo um parametro obrigatorio
- `Query/Search Param`: Modificar/Filtrar resultados (Busca/ paginacao/ ordenacao), sendo paramentros opcionais

> OBS.: Quando utilizamos o Query Params, as informações ficam expostas diretamente na URL, o que pode ser considerada uma falha de seguranca a depender da requisição realizada.

`POST localhost:3333/users`

- `Request Body`: Dados para criacao/atualizacao de um recurso (Obrigatorios ou opcionais)
  - O Request Body deve ser utilizado somente para `POST/PUT/PATCH`

```json
{
  "email": "johndoe@gmail.com",
  "password": "123456"
}
```

- Headers (Cabecalhos): Utilizado para enviar `metadados`
  - Metadados: Informações adicionais que nao alteram o resultado/funcionamento.

```sh
POST  localhost:3333/users

# Forma como o back-end vai retornar a informação
HEADER -> Accept-Language: en
{ message: "Usuario nao existe" }
```

## HTTP Status Code

Toda requisição enviada para o Backend retorna um `HTTP Status Code`, utilizados para identificar o tipo de retorno.

### Status Code 2xx

Status que retornam `2xx`, como por exemplo `200` (OK), `201` (Created), `202` (Accepted - API Processou porém não garante que foi criado) identificam que uma requisição foi bem sucedida.

### Status Code 3xx

Status code que retornam `3xx`, como por exemplo `301`, `302`, sao utilizados para identificar retornos de redirecionamento.

### Status Code 4xx

Status code da "Familia" `4xx` , identificam erros do lado do cliente no momento da requisição, como por exemplo `400` (Bad Request), `401` (Unauhtorized), `404` (Not Found) etc.

> 418: Meme to I'm teapot

### Status Code 5xx

Status Code da "familia " `5xx` identificam-se erros do lado do servidor, como por exemplo `500` (Internal Server Error), `501` (Not Implemented), `502` (Bad Gateway).

Documentacao de Auxilio: [Mozilla MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)

## Iniciando o Projeto

### Criando um servidor

**Nativa:** A criacao de um servidor de forma nativa, utilizando funções próprias do Node não é preferível devido a complexidade no momento da criação das rotas, considere o exemplo abaixo para a criação de rotas do tipo `GET` e `POST`.

```js
const http = require("node:http");

const server = http.createServer((request, reply) => {
  if (request.url === "/users" && request.method === "GET") {
    reply.write("Listar Usuarios");
  } else if (request.url === "/users" && request.method === "POST") {
    reply.write("Criar Usuario");
  } else {
    reply.write("Rota não encontrada");
  }
  reply.end();
});

server.listen(3333).on("listening", () => {
  console.log("HTTP server running!");
});
```

Portanto, é muito mais fácil utilizar frameworks para esse cenário, como por exemplo:

- Estilo Laravel/Rails/Django => `NestJS`/`Adonis`
- Estilo Lunen/Sinatra/Flask/FastAPI => `Express`/`Fastify`/`Hono`/`Hapi`/`Koa`

Contudo, para as aulas em questão, estaremos utilizando o `fastify`, por ser um microframework mais eficiente e com um suporte melhor

### Instalando o Fastify

```sh
npm i fastify
```

### Criando o Servidor

```js
const fastify = require("fastify");

const server = fastify();

server.get("/courses", () => {
  return [];
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP Server is running!");
});
```

> OBS.: Sempre retorne um objeto nas rotas.

> OBS.: não é possivel, com JSON, realizar o envio de arquivos, para isso seria necessário converter em base64 (método de codificação que representa dados binários), contudo o tamanho do arquivo aumenta. Para realizar o envio de arquivos, utiliza-se o multipart/form-data

### Estruturando as rotas

```js
const fastify = require("fastify");
const crypto = require("crypto");

const server = fastify();

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
];

server.get("/courses", () => {
  return { courses };
});

server.get("/courses/:id", (request, reply) => {
  const courseId = request.params.id;

  const course = courses.find((course) => course.id === courseId);

  if (course) {
    return reply.send({ course });
  }

  return reply.status(404).send("Course not found");
});

server.post("/courses", (request, reply) => {
  const courseId = crypto.randomUUID();
  const courseTitle = request.body.title;

  if (!courseTitle) {
    return reply.status(400).send("Course title is required");
  }

  courses.push({ id: courseId, title: courseTitle });

  return reply.status(201).send({
    id: courseId,
  });
});

server.listen({ port: 3333 }).then(() => {
  console.log("HTTP Server is running!");
});
```

### Chamadas HTTP

```http
@baseURL = http://localhost:3333

###
GET {{baseURL}}/courses

###
POST {{baseURL}}/courses
Content-Type: application/json

{
  "title": "Novo Curso"
}
###

GET {{baseURL}}/courses/5

###
```

## Aprimorando o Projeto

Para seguirmos com o projeto daqui pra frente, estaremos realizando a instalação do typescript e a integração do typescript com o node, executando o comando abaixo no terminal:

```sh
# Instalacao do Typescript e Integracao com o node
npm i typescript @types/node -D
# Criando arquivo de configuração do typescript
npx tsc --init
```

**Porque utilizar Typescript?**

No fim das contas o Typescript é convertido em código Javascript, além disso, o Typescript é utilizado por possuir uma tipagem estática o que facilita o controle das propriedades de cada entidade.

Portanto, nossa aplicação passa a necessitar de tipagem nos parâmetros de rota, por exemplo.

```ts
server.post("/courses", (request, reply) => {
  // Tipagem mencionada no paragrafo acima
  type Body = {
    title: string;
  };

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
});
```

> Para rodar typescript em versões mais antigas do Node, é necessário utilizar experimental-strip-types como parâmetro do script no `npm run dev`.

**Objeto Logger**

A fim de visualizar todas as requisições da nossa API, é possivel adicionar na nossa instancia do fastify o objeto logger com valor true:

```ts
const server = fastify({ logger: true });
```

Contudo, os logs ficam feios e com leitura poluida, para melhorar essa visualização é possivel utilizar um plugin denominado `pino-pretty` do fastify. Execute o seguinte comando, e altere nossa instacia do fastify:

```sh
npm i pino-pretty
```

```ts
const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
});
```

---

## Aula 02 - Conceitos

- Docker
- ORM

### Docker

Ao utilizar o Docker, passamos através de um arquivo `docker-compose.yml` todos os pacotes necessários para execução do projeto. Podemos encontrar todos os pacotes disponíveis para utilização do docker no `DockerHub`.

> DockerHub: Central onde podemos encontrar todas as imagens/dependências de um projeto do docker.

O Docker se sobressai com relação à máquinas virtuais, isso porque não é necessário a recriação de uma máquina pois, ele apenas reaproveita os recursos da máquina host.

Antigamente era mais complexo de utilizar o docker no sistema operacional Windows devido o Kernel do sistema, contudo após algumas atualizações do Windows, o sistem veio com uma ferramenta denominada WSL - Windows Subsystem for Linux o qual permite possuirmos arquivos do kernel do Unix no Windows.

### ORM - Object Relational Mapping

ORMS mais utilizados em cada tecnologia:

- Java -> Hibernate
- Ruby -> Active Record
- PHP/Laravel -> Eloquent/Doctrine
- GO -> GORM
- Python -> SQLAchemy

> Os 3 Principais ORMs que serviram como base para desenvolvimento de outros foram o Hibernate, Active Record e Doctrine.

Um ORM, em seu conceito original, é utilizado para relacionar a Programação Orientada a Objetos com o modelo relacional de Banco de Dados. Quando comparamos o conceito inicial com as ferramentas utilizadas hoje, Drizzle, Prisma, Sequelize, essas ferramentas não seriam consideradas ORMs naturalmente.

Contudo, um ORM surge como maneira de manipular/trabalhar com banco de dados de uma maneira mais simples e fácil integrada ao código. Seguem exemplos de ORMs que poderiam ser utilizados no projeto e a respectiva justificativa do porque não serão ou serão utilizados neste desafio.

| **ORM**   | **Justificativa**                    |
| --------- | ------------------------------------ |
| Sequelize | Query Language Complexa              |
| TypeORM   | Decorators/Query Language            |
| Prisma    | Melhor DX/ Sintaxe longe do SQL      |
| Drizzle   | Pior DX/ Sintaxe mais proxima do SQL |

> DX: Development Experience

ORM Escolhido: Drizzle, a esolha se dá pelos seguintes motivos:

- Facilidade em trabalhar com a tipagem dos dados, toda query retorna o output tipado.
- Migrations: Utilizada para realizar o versionamento das alterações do banco de dados evitando possíveis conflitos durante o desenvolvimento.

> QueryBuilder: Diferente de um ORM um `QueryBuilder` tem a finalidade de auxiliar na escrita da query, tornando-a mais amigável, não dando importância para o resto do controle do banco de dados.

## Arquivo `docker-compose.yml`

### Configuração Básica

```yml
# docker-compose.yml - Required Services Configuration
services:
  db:
    # Nome e versão da imagem a ser utilizada (Pode ser adquirida no DockerHub)
    image: postgres:17
    # Definição de Variaveis ambiente
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: desafio_nodejs
    # Portas de redirect
    ports:
      - "5432:5432"
```

> As portas de redirect funcionam como um PORT FORWARDING a porta `5432` do postgres corresponde a porta `5432` da máquina cujo está tentando realizar o acesso também.

Para executar subir a imagem do docker com os serviços mencionados, basta executar o seguinte comando:

```sh
# Executar serviços
docker compose up
docker compose up -d

# Parar serviços
docker compose down

# Remover volumes (CUIDADO: perde dados)
docker compose down -v

# Ver logs
docker compose logs db

# Executar comandos no container
docker compose exec db psql -U postgres -d desafio_nodejs

# Backup do volume
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restaurar backup
docker run --rm -v postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## Drizzle ORM

### Instalação do Drizzle

```sh
npm i drizzle-kit -D
npm i drizzle-orm pg
```

- `npm i drizzle-kit -D`:  
  Instala o **drizzle-kit** como dependência de desenvolvimento (`-D`).  
  **drizzle-kit** é uma ferramenta CLI usada para gerar e gerenciar migrations do banco de dados.  
  Ele não é necessário em produção, pois só é usado para criar/atualizar o esquema do banco durante o desenvolvimento.

- `npm i drizzle-orm pg`:  
  Instala o **drizzle-orm** e o **pg** como dependências do projeto.
  - **drizzle-orm** é a biblioteca ORM que permite manipular o banco de dados usando código TypeScript/JavaScript, com tipagem forte e queries próximas do SQL.
  - **pg** é o driver oficial do Node.js para conectar e interagir com bancos de dados PostgreSQL.  
    Ele é necessário para que o drizzle-orm consiga se comunicar com o banco.

**Diferença entre `postgres` e `pg`:**

- O pacote `pg` é o driver oficial e mais utilizado para PostgreSQL no Node.js e possui Instrumentação Automática, entrando no conceito Observabilidade.
- O pacote `postgres` é uma alternativa, com API diferente e algumas otimizações, mas o drizzle-orm recomenda o uso do `pg` para integração.

### Configuração do Drizzle

Para configurarmos o drizzle, devemos criar um arquivo `drizzle.config.ts` e um arquivo para armazenarmos nossas variáveis ambiente, `.env`.

Arquivo `.env`:

```env
# postgresql connection string for the database
# Format: postgresql://<user>:<password>@<host>:<port>/<database>
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/desafio_nodejs"
```

Arquivo `drizzle.config.ts`:

```ts
// drizzle.config.ts - Drizzle ORM Configuration
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("The DATABASE_URL env is required");
}

export default defineConfig({
  // Used to define what is the database
  dialect: "postgresql",
  dbCredentials: {
    // Connection string to the database
    url: process.env.DATABASE_URL,
  },
  // Folder used by Drizzle to storage automatic files
  out: "./drizzle",
  // Locate table files (Schemas database)
  schema: "",
});
```

**Como criar tabelas com Drizzle?**

Para realizar a criacao de tabelas utilizando o ORM, basta seguir a seguinte estrutura:

```ts
import { uuid } from "drizzle-orm/pg-core";
import { text } from "drizzle-orm/pg-core";
import { pgTable } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
});
```

Onde cada campo possui funcoes que representam o tipo de campo e regras referentes a estrutura do banco de dados, no exemplo acima, considere que ao mencionar `text()`, `primaryKey()` etc, nada mais sao do que estabelecer constraints de valores para os campos do banco de dados.

Após realizar a criação da tabela usuários conforme o exemplo acima, é necessário `gerar` nosso arquivo SQL onde conterá a sintaxe SQL de criação da nossa tabela, e posteriormente `migrar` essas mudanças, como? Basta executar os 2 comandos abaixo, respectivamente:

```sh
npx drizzle-kit generate
npx drizzle-kit migrate
```

## Validação de dados da requisição

Para realizar a validação dos dados enviados no corpo de uma requisição, será utilizado a biblioteca do `zod` e instalaremos, também, uma integração do fastify com o Zod, o `Fastify Types Provider Zod`, sendo uma extensão/plugin que une as validações e tipos do Zod ao ciclo de vida do Fastify, facilitando o uso seguro, tipado e validado de dados em APIs modernas.

Documentação auxiliar: [Zod](https://zod.dev/) / [Fastify Types Provider Zod](https://fastify.dev/docs/latest/Reference/Type-Providers/)

Para realizar a instalação de ambos, execute o comando abaixo no terminal:

```sh
npm i zod fastify-types-provider-zod
```

### Diferença entre Serialização e Validação

- **Validação:** Realiza a checagem nos dados de entrada.
- **Serialização:** Forma de converter os dados de saída de uma rota em outro formato.

Para adicionar validação na entrada dos dados, estaremos importando o `type ZodTypeProvider`, realizando as alterações no código abaixo:

```ts
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
} from "fastify-type-provider-zod";
import { z } from "zod/v4";

const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

server.post(
  "/courses",
  {
    schema: {
      body: z.object({
        title: z.string().min(5, "Minimum 5 characters is required!"),
      }),
    },
  },
  async (request, reply) => {
    const courseTitle = request.body.title;

    const result = await db
      .insert(courses)
      .values({ title: courseTitle })
      .returning();

    return reply.status(201).send({ courseId: result[0].id });
  }
);
```

## Documentação

Para realizar a montagem da documentação automática utilizaremos um pacote do fastify denominado Swagger - Formato da documentação: Open API.

```sh
npm i @fastify/swagger
npm i @fastify/swagger-ui
```

No nosso arquivo `server.ts`, podemos configurar o swagger e o swagger ui da seguinte forma:

```ts
import { fastifySwagger } from "@fastify/swagger";
import { fastifySwaggerUi } from "@fastify/swagger-ui";
import {
  validatorCompiler,
  serializerCompiler,
  type ZodTypeProvider,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";

export const server = fastify({
  logger: {
    transport: {
      target: "pino-pretty",
      options: {
        translateTime: "HH:MM:ss Z",
        ignore: "pid,hostname",
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>();

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Rocketseat - Desafio Node.js",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

server.register(fastifySwaggerUi, {
  routePrefix: "/docs",
});
```

> OBS.: Após realizar esse setup em nosso código, e acessar a rota `localhost:3333/docs`, ainda não será possível visualizar nenhuma documentação, isso porque o fastify trabalha de forma assíncrona, para contornarmos isso vamos registrar nossas rotas no diretório `src/routes/*.ts`.

Cada rota deverá ser constituida utilizando o `FastifyPluginAsyncZod`, da seguinte forma:

```ts
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import { z } from "zod/v4";
import { eq } from "drizzle-orm";

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses/:id",
    {
      schema: {
        params: z.object({
          id: z.uuid(),
        }),
      },
    },
    async (request, reply) => {
      const courseId = request.params.id;

      const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));

      if (result.length > 0) {
        return { course: result[0] };
      }

      return reply.status(404).send({ message: "Course not found" });
    }
  );
};
```

Ainda seguindo a estruturação de nossa api, podemos aprimorar nossa documentação utilizando outras propriedades no nosso schema:

```ts
export const getCourseByIdRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses/:id",
    {
      schema: {
        tags: ["courses"],
        summary: "Get a course by ID",
        description:
          "This route receives a course ID as a parameter and returns the properties of that course.",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            course: z.object({
              id: z.uuid(),
              title: z.string(),
              description: z.string().nullable(),
            }),
          }),
          404: z.null().describe("Course not found"),
        },
      },
    },
    async (request, reply) => {
      const courseId = request.params.id;

      const result = await db
        .select()
        .from(courses)
        .where(eq(courses.id, courseId));

      if (result.length > 0) {
        return { course: result[0] };
      }

      return reply.status(404).send({ message: "Course not found" });
    }
  );
};
```

Documentação auxiliar do Swagger: [Fastify Swagger](https://www.npmjs.com/package/@fastify/swagger-ui)

### Alternativa para o SwaggerUi

> Uma alternativa para o Swagger UI é o Scalar fastify, para realizar a instalação do pacote, siga os proximos passos.

```sh
npm install @scalar/fastify-api-reference
```

Para isso poderemos remover o `swagger-ui` e seguirmos apenas com o `Scalar`, removendo importações não utilizadas e alterando as lihas de código para:

```ts
import scalarAPIReference from "@scalar/fastify-api-reference";

server.register(scalarAPIReference, {
  routePrefix: "/docs",
});
```

> É possível realizar a configuração de temas também, caso desejado, além disso o Scalar Fastify possui um API Client que funciona como o Insomnia, Postman etc.

### Restringindo o acesso as docs

Para restringir o acesso à documentação da nossa API, nós podemos criar uma variável no arquivo `.env` e criar um condicional no arquivo `server.ts`, a partir dessa alteração, somente pessoas com acesso ao ambiente de desenvolvimento conseguirão visualizar a documentação.

```env
NODE_ENV=development
```

```ts
if (process.env.NODE_ENV === "development") {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Rocketseat - Desafio Node.js",
        version: "1.0.0",
      },
    },
    transform: jsonSchemaTransform,
  });

  server.register(scalarAPIReference, {
    routePrefix: "/docs",
    configuration: {
      title: "Docs - Challenge Node.js API Reference",
      theme: "deepSpace",
    },
  });
}
```

## Query Params

Para utilizar query params nas rotas criadas, você poderá estruturar da seguinte forma:

```ts
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import { z } from "zod/v4";
import { ilike, asc } from "drizzle-orm";

export const getCoursesRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    "/courses",
    {
      schema: {
        tags: ["courses"],
        summary: "Get all Courses",
        description: "Return all courses with properties",
        querystring: z.object({
          search: z.string().optional(),
          orderBy: z.enum(["id", "title"]).optional().default("title"),
          page: z.coerce.number().optional().default(1),
        }),
        response: {
          200: z.object({
            courses: z.array(
              z.object({
                id: z.uuid(),
                title: z.string(),
              })
            ),
            total: z.number(),
          }),
        },
      },
    },
    async (request, reply) => {
      const { search, orderBy, page } = request.query;

      const [result, total] = await Promise.all([
        db
          .select({
            id: courses.id,
            title: courses.title,
          })
          .from(courses)
          .orderBy(asc(courses[orderBy]))
          .where(search ? ilike(courses.title, `%${search}%`) : undefined)
          .limit(10)
          .offset((page - 1) * 10),
        db.$count(
          courses,
          search ? ilike(courses.title, `%${search}%`) : undefined
        ),
      ]);

      return reply.send({ courses: result, total });
    }
  );
};
```

**Explicação dos parâmetros:**

- **`search`**: Parâmetro opcional para buscar cursos por título (case insensitive)
- **`orderBy`**: Parâmetro para ordenar resultados por `id` ou `title` (padrão: `title`)
- **`page`**: Parâmetro para paginação simples (padrão: `1`)

**Operadores utilizados:**

- **`ilike`**: Case insensitive, padroniza o termo em lowercase para evitar divergências na busca
- **`asc`**: Utilizado para ordenação crescente
- **`$count`**: Método do Drizzle para contar registros de forma otimizada
- **`Promise.all`**: Executa queries em paralelo para melhor performance

**Exemplo de uso:**

```http
GET /courses?search=node&orderBy=title&page=1
GET /courses?search=react&page=2
GET /courses?orderBy=id
```

## Paginação

Tipos de paginação:

- Offset Pagination
- Cursor-based Pagination

### Offset Pagination

O Offset Pagination usa números de página e tamanho da página para navegar pelos resultados. É mais simples de implementar, mas pode ter problemas de performance com grandes datasets.

### Cursor-based Pagination

O Cursor-based Pagination usa um cursor (geralmente um ID ou timestamp) para navegar pelos resultados. É mais eficiente e consistente, especialmente para dados que mudam frequentemente.

### Comparação Prática

| Aspecto           | Offset Pagination               | Cursor-based Pagination     |
| ----------------- | ------------------------------- | --------------------------- |
| **Performance**   | Degrada com grandes datasets    | Consistente                 |
| **Navegação**     | Permite ir para qualquer página | Apenas próxima/anterior     |
| **Consistência**  | Pode pular/duplicar registros   | Sempre consistente          |
| **Implementação** | Simples                         | Mais complexa               |
| **Casos de uso**  | Dashboards, relatórios          | Feeds, listas em tempo real |

### Quando usar cada um?

**Use Offset Pagination quando:**

- Precisa de navegação direta para páginas específicas
- Dataset pequeno a médio
- Interface de usuário com numeração de páginas
- Relatórios ou dashboards

**Use Cursor-based Pagination quando:**

- Dataset grande
- Dados mudam frequentemente
- Performance é crítica
- Feeds em tempo real
- APIs públicas com alto volume de requisições

Video Auxiliar: [Youtube - Rocketseat](https://youtu.be/gD_jNycKo-c?si=Lh_5498sJd-EbPMf)

## Seed Database

- Biblioteca Faker, utilizada para geração de dados aleatórios e fictícios para fins de alimentação do banco de dados.

> OBS.: É possível realizar a geração de dados fictícios para alimentação do banco de dados utilizando o drizzle também, contudo isso seria utilizado para uma geração massiva de dados, o que não é o caso, por essa razão a biblioteca escolhida foi o `faker-js`

```sh
npm i @faker-js/faker -D
```

Documentação Auxiliar: [Faker-js](https://fakerjs.dev/)

### Função seed

Estaremos realizando a criação da função de seed do banco, considerando a biblioteca faker, após isso estaremos criando um script para execução do seed.

```ts
import { db } from "./client.ts";
import { courses, enrollments, users } from "./schema.ts";
import { fakerPT_BR as faker } from "@faker-js/faker";

async function seed() {
  const userInsert = await db
    .insert(users)
    .values([
      { name: faker.person.fullName(), email: faker.internet.email() },
      { name: faker.person.fullName(), email: faker.internet.email() },
      { name: faker.person.fullName(), email: faker.internet.email() },
    ])
    .returning();

  const coursesInsert = await db
    .insert(courses)
    .values([{ title: faker.lorem.words(4) }, { title: faker.lorem.words(4) }])
    .returning();

  await db.insert(enrollments).values([
    { courseId: coursesInsert[0].id, userId: userInsert[0].id },
    { courseId: coursesInsert[0].id, userId: userInsert[1].id },
    { courseId: coursesInsert[1].id, userId: userInsert[2].id },
  ]);
}

seed();
```

Atualizando o `package.json`:

```json
{
  "scripts": {
    "db:seed": "node --env-file .env src/database/seed.ts"
  }
}
```

## Testes Automatizados

Para realizar a montagem de testes em nossa aplicação, poderemos utilizar o `vitest` ou o `jest`. Sendo as ferramentas mais famosas para tal objetivo, a diferença entre os dois consiste na velocidade.

```sh
npm i vitest -D
```

### Tipos de Testes

- **E2E - End to End**: Testam a aplicação de ponta a ponta, ou seja, todas as funcionalidades do início ao fim.
  - Em testes E2E, por serem mais lentos em sua execução, são testados apenas o `Happy Path`, ou seja, o caminho em que tudo da certo
- **Unit - Unitários**: Testa uma pequena parte da aplicação isolada do restante
  - Os testes unitários são responsáveis pela execução do caminho de erros onde serão validados todas as possibilidades de erros da aplicação.
- **Integration**: Testes de integração são utilizados para validar como componentes/partes do código se conversam

> **Mocking**: Ato de fornecer funcionamento fictício à alguma parte da nossa aplicação, geralmente por conta da funcionalidade depender de uma ferramenta de terceiros que envolva custos.

### Estruturação Correta de Testes

#### 1. **Organização de Arquivos**

A estrutura de testes deve espelhar a estrutura do código fonte:

```
src/
├── routes/
│   ├── create-course.ts
│   ├── create-course.test.ts
│   ├── get-courses.ts
│   ├── get-courses.test.ts
│   ├── get-course-by-id.ts
│   └── get-course-by-id.test.ts
├── database/
│   ├── client.ts
│   ├── schema.ts
│   └── seed.ts
└── utils/
    ├── helpers.ts
    └── helpers.test.ts
```

#### 2. **Configuração do Vitest**

Crie um arquivo `vitest.config.ts` na raiz do projeto:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    setupFiles: ["./src/test/setup.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

#### 3. **Setup de Testes**

Crie um arquivo `src/test/setup.ts` para configurações globais:

```ts
import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { db } from "../database/client";
import { courses, users, enrollments } from "../database/schema";

// Limpa o banco antes de cada teste
beforeEach(async () => {
  await db.delete(enrollments);
  await db.delete(courses);
  await db.delete(users);
});

// Fecha conexão após todos os testes
afterAll(async () => {
  await db.end();
});
```

#### 4. **Estrutura de um Teste Completo**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { server } from "../../server";
import { db } from "../../database/client";
import { courses } from "../../database/schema";

describe("POST /courses", () => {
  beforeEach(async () => {
    // Limpa dados específicos antes de cada teste
    await db.delete(courses);
  });

  it("should create a course successfully", async () => {
    const courseData = {
      title: "Node.js Fundamentals",
    };

    const response = await server.inject({
      method: "POST",
      url: "/courses",
      payload: courseData,
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toHaveProperty("courseId");
    expect(typeof JSON.parse(response.payload).courseId).toBe("string");
  });

  it("should return 400 when title is too short", async () => {
    const courseData = {
      title: "Node", // Menos de 5 caracteres
    };

    const response = await server.inject({
      method: "POST",
      url: "/courses",
      payload: courseData,
    });

    expect(response.statusCode).toBe(400);
  });

  it("should return 400 when title is missing", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/courses",
      payload: {},
    });

    expect(response.statusCode).toBe(400);
  });
});
```

#### 5. **Testes de Integração com Banco de Dados**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { server } from "../../server";
import { db } from "../../database/client";
import { courses } from "../../database/schema";

describe("GET /courses/:id", () => {
  let courseId: string;

  beforeEach(async () => {
    // Cria um curso para testar
    const result = await db
      .insert(courses)
      .values({
        title: "Test Course",
      })
      .returning();

    courseId = result[0].id;
  });

  it("should return course by id", async () => {
    const response = await server.inject({
      method: "GET",
      url: `/courses/${courseId}`,
    });

    expect(response.statusCode).toBe(200);

    const payload = JSON.parse(response.payload);
    expect(payload.course).toMatchObject({
      id: courseId,
      title: "Test Course",
    });
  });

  it("should return 404 for non-existent course", async () => {
    const fakeId = "123e4567-e89b-12d3-a456-426614174000";

    const response = await server.inject({
      method: "GET",
      url: `/courses/${fakeId}`,
    });

    expect(response.statusCode).toBe(404);
  });
});
```

#### 6. **Testes com Query Parameters**

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { server } from "../../server";
import { db } from "../../database/client";
import { courses } from "../../database/schema";

describe("GET /courses", () => {
  beforeEach(async () => {
    // Cria cursos de teste
    await db
      .insert(courses)
      .values([
        { title: "Node.js Advanced" },
        { title: "React Fundamentals" },
        { title: "TypeScript Basics" },
      ]);
  });

  it("should return all courses", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/courses",
    });

    expect(response.statusCode).toBe(200);

    const payload = JSON.parse(response.payload);
    expect(payload.courses).toHaveLength(3);
  });

  it("should filter courses by search parameter", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/courses?search=Node",
    });

    expect(response.statusCode).toBe(200);

    const payload = JSON.parse(response.payload);
    expect(payload.courses).toHaveLength(1);
    expect(payload.courses[0].title).toContain("Node");
  });

  it("should paginate results", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/courses?page=1",
    });

    expect(response.statusCode).toBe(200);

    const payload = JSON.parse(response.payload);
    expect(payload.courses).toHaveLength(3);
    expect(payload.total).toBe(3);
  });
});
```

#### 7. **Testes com Mocking**

```ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { server } from "../../server";

// Mock de uma função externa
vi.mock("../../database/client", () => ({
  db: {
    insert: vi.fn(),
    select: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("POST /courses with mocked database", () => {
  it("should handle database errors gracefully", async () => {
    const { db } = await import("../../database/client");

    // Simula erro no banco
    vi.mocked(db.insert).mockRejectedValue(
      new Error("Database connection failed")
    );

    const response = await server.inject({
      method: "POST",
      url: "/courses",
      payload: { title: "Test Course" },
    });

    expect(response.statusCode).toBe(500);
  });
});
```

#### 8. **Testes de Validação com Zod**

```ts
import { describe, it, expect } from "vitest";
import { server } from "../../server";

describe("Course validation", () => {
  it("should validate required fields", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/courses",
      payload: {}, // Sem título
    });

    expect(response.statusCode).toBe(400);

    const payload = JSON.parse(response.payload);
    expect(payload.message).toContain("title");
  });

  it("should validate minimum length", async () => {
    const response = await server.inject({
      method: "POST",
      url: "/courses",
      payload: { title: "abc" }, // Menos de 5 caracteres
    });

    expect(response.statusCode).toBe(400);
  });

  it("should validate UUID format", async () => {
    const response = await server.inject({
      method: "GET",
      url: "/courses/invalid-uuid",
    });

    expect(response.statusCode).toBe(400);
  });
});
```

#### 9. **Scripts de Teste no package.json**

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

#### 10. **Boas Práticas**

1. **Nomenclatura**: Use nomes descritivos para testes

   ```ts
   it("should return 404 when course does not exist");
   it("should create course with valid data");
   it("should validate required fields");
   ```

2. **Arrange-Act-Assert**: Estruture testes em 3 partes

   ```ts
   it("should create course", async () => {
     // Arrange - Preparar dados
     const courseData = { title: "Test Course" };

     // Act - Executar ação
     const response = await server.inject({
       method: "POST",
       url: "/courses",
       payload: courseData,
     });

     // Assert - Verificar resultado
     expect(response.statusCode).toBe(201);
   });
   ```

3. **Isolamento**: Cada teste deve ser independente
4. **Limpeza**: Sempre limpe dados após testes
5. **Cobertura**: Busque alta cobertura de código
6. **Performance**: Use `beforeEach` para setup comum

#### 11. **Diferenças entre Vitest e Jest**

| Aspecto             | Vitest              | Jest                 |
| ------------------- | ------------------- | -------------------- |
| **Velocidade**      | Mais rápido         | Mais lento           |
| **Configuração**    | Mais simples        | Mais complexa        |
| **Compatibilidade** | Compatível com Jest | Padrão da comunidade |
| **TypeScript**      | Suporte nativo      | Requer configuração  |
| **Watch Mode**      | Mais eficiente      | Menos eficiente      |

#### 12. **Migração de Jest para Vitest**

Se você já usa Jest, a migração é simples:

1. Instale o Vitest: `npm i -D vitest`
2. Substitua imports: `jest` → `vitest`
3. Atualize configuração no `package.json`
4. Execute testes: `npm test`

A maioria dos testes Jest funcionará sem modificações no Vitest.

## Gerenciamento de Variáveis de Ambiente

### dotenv-cli

```sh
npm i dotenv-cli -D
```

O `dotenv-cli` é uma ferramenta de linha de comando que permite carregar variáveis de ambiente de arquivos `.env` específicos durante a execução de comandos. No projeto em questão, essa dependência é essencial para gerenciar diferentes configurações de ambiente.

#### **Por que é necessário?**

1. **Múltiplos Ambientes**: O projeto utiliza diferentes arquivos `.env` para diferentes contextos:

   - `.env` - Ambiente de desenvolvimento
   - `.env.test` - Ambiente de testes

2. **Isolamento de Testes**: Durante os testes, é necessário usar um banco de dados separado para não interferir nos dados de desenvolvimento.

3. **Flexibilidade**: Permite executar comandos com variáveis de ambiente específicas sem modificar o código.

#### **Como funciona no projeto:**

```json
{
  "scripts": {
    "pretest": "dotenv -e .env.test drizzle-kit migrate",
    "test": "dotenv -e .env.test vitest run"
  }
}
```

**Explicação dos scripts:**

- **`pretest`**: Executa automaticamente antes do comando `test`

  - `dotenv -e .env.test` - Carrega variáveis do arquivo `.env.test`
  - `drizzle-kit migrate` - Executa migrações no banco de testes

- **`test`**: Executa os testes usando as variáveis do `.env.test`

#### **Estrutura de arquivos .env recomendada:**

```env
# .env (Desenvolvimento)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/desafio_nodejs"
NODE_ENV=development
```

```env
# .env.test (Testes)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/desafio_nodejs_test"
NODE_ENV=test
```

#### **Vantagens do dotenv-cli:**

1. **Segurança**: Mantém configurações sensíveis separadas por ambiente
2. **Flexibilidade**: Permite usar diferentes bancos de dados para testes
3. **Automação**: Scripts podem ser executados com configurações específicas
4. **Isolamento**: Testes não interferem no ambiente de desenvolvimento

#### **Configuração adicional:**

Para outros comandos que precisem de variáveis específicas:

```json
{
  "scripts": {
    "db:seed:test": "dotenv -e .env.test node src/database/seed.ts",
    "db:studio:test": "dotenv -e .env.test drizzle-kit studio"
  }
}
```

#### **Boas práticas:**

1. **Nunca commitar arquivos .env** no repositório
2. **Criar .env.example** com estrutura sem valores sensíveis
3. **Usar nomes descritivos** para diferentes ambientes
4. **Documentar** as variáveis necessárias no README

```env
# .env.example
DATABASE_URL="postgresql://user:password@host:port/database"
NODE_ENV=development
```

O `dotenv-cli` é uma ferramenta essencial para projetos que precisam gerenciar múltiplos ambientes de forma eficiente e segura, especialmente quando se trabalha com testes automatizados.

### Dependência Supertest

A Dependência em questão será utilizada para realizar requisições HTTP à nossa aplicação.

> OBS.: Quando instalamos bibliotecas escritas nativamente em javascript, necessitamos instalar a integração com o typescript, nesse caso estaremos instalando `supertest`

```sh
npm i supertest -D
npm i @types/supertest -D
```

Documentação Auxiliar: [Supertest - Testando requisições HTTP](https://www.npmjs.com/package/supertest)

## Test x Factories

Uma factorie é utilizada para realizar a criação de uma entidade em nosso banco de dados para que o teste possa dar sequência. No caso do projeto, utilizamos uma "factorie" ao construir o arquivo `make-course.ts`. São específicas para criação de objetos voltados para teste.

## Coverage

Pensando na cobertura de testes, uma ferramenta que auxilia a entender toda a estrutura de testes feita, uma possibilidade é utilizar o `coverage`. Essa ferramenta gera o diretório `./coverage`

Exemplo de retorno: 

% Coverage report from v8

File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   80.18 |    76.92 |   71.42 |   80.18 |                  
 src                  |   53.33 |        0 |       0 |   53.33 |                  
  app.ts              |   58.53 |        0 |     100 |   58.53 | 27-44            
  server.ts           |       0 |        0 |       0 |       0 | 1-5              
 src/database         |   52.17 |        0 |       0 |   52.17 |                  
  client.ts           |     100 |      100 |     100 |     100 |                  
  schema.ts           |    90.9 |      100 |     100 |    90.9 | 24-25            
  seed.ts             |       0 |        0 |       0 |       0 | 1-25             
 src/routes           |     100 |      100 |     100 |     100 |                  
  create-course.ts    |     100 |      100 |     100 |     100 |                  
  get-course-by-id.ts |     100 |      100 |     100 |     100 |                  
  get-courses.ts      |     100 |      100 |     100 |     100 |                  
 src/tests/factories  |     100 |      100 |     100 |     100 |                  
  make-course.ts      |     100 |      100 |     100 |     100 |                  
  make-enrollment.ts  |       0 |        0 |       0 |       0 |                  

============================ Coverage summary ============================

Statements: 80.18% (174/217)

Branches: 76.92% (10/13)

Functions: 71.42% (5/7)

Lines: 80.18% (174/217)

======================================================================

Documentação auxiliar: [Coverage - Vitest](https://vitest.dev/guide/coverage.html)

## Novos campos no banco de dados

Realizamos a criação de 2 novos campos na tabela de usuários, sendo eles o de password e o de role, com tipo string e enum, respectivamente.

> OBS.: Para a senha, não podemos armazenar a senha crua no banco de dados, portanto, devemos utilizar algoritmos de hash para que possam ser armazenadas em segurança, abaixo estão 2 dos famosos algoritmos mais usados para tal finalidade.

### Criptografia de dados

Para salvarmos a senha de nosso usuário no banco de dados, nunca devemos salvar a senha "pura", e sim utilizarmos algoritmos de criptografia adequados para tal finalidade.

Nessa situação temos 2 famosos algoritmos, o `bcrypt` e o `argon2`

Documentações auxiliares: 
  Documentação [Bcrypt](https://www.npmjs.com/package/bcrypt) 
  Documentação [Argon2](https://www.npmjs.com/package/argon2)

## Autenticação

### Métodos de Autenticação

- Exemplo: Tabela de sessões - Segue padrão Stateful (Armazena um estado para continuar funcionando), o que depende da inserção de novos registros no banco de dados e a cada login uma nova consulta tem que ser realizada no banco, essa estratégia é boa e útil quando menciona-se o "Revoke", ou seja, revogar acessos da aplicação.
- JWT: O JWT Funciona baseado num algoritmo de criptografia de chave simétrica

#### Chave Simétrica e Assimétrica

- Chave Simétrica: Há uma única chave que faz a criação de novos tokens e a validação dos tokens previamente criados a fim de verificar se são válidos. Em termos técnicos, uma única chave secreta é compartilhada entre o remetente e o destinatário. Essa chave é usada para codificar e decodificar a mensagem.
- Chave Assimétrica: 2 Chaves são utilizadas, uma sendo a chave pública e outra privada, uma sendo utilizada para criação dos tokens e outra para validação destes.

Documentação Auxiliar: [Chave Simétrica]() [Chave Assimétrica]()

#### JWT - Json Web Token

```html
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30
```

Conforme podemos notar no exemplo de Token acima, o JWT é dividido em 3 partes, uma sendo o `Header` que contém o algoritmo de criptografia e o tipo.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

Infromações do `Payload`: 

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022
}
```

> OBS.: Qualquer informação sensivel, não deve estar contida no payload do JWT, além disso, qualquer informação alterada no payload é verificada na 3ª etapa, a assinatura onde, qualquer informação alterada, a assinatura também será alterada.

##### Instalação Json Web Token

```sh
npm i jsonwebtoken
npm i @types/jsonwebtoken
```

Documentação Auxiliar: [JWT - Json Web Token](https://www.jwt.io/)

### Validação nas rotas



## Deploy da Aplicação

Para realizar o deploy da aplicação node, podemos e vamos utilizar o dockerfile, onde conterá todas as informações de geração da nossa imagem para geração do serviço e utilização em outras máquinas.