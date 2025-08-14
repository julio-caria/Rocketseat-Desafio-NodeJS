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
    "nome":   "Diego Fernandes"
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

- `https` ->  Protocolo
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
  email: "johndoe@gmail.com",
  password: "123456"
}
```

- Headers (Cabecalhos): Utilizado para enviar `metadados`
  - Metadados:  Informações adicionais que nao alteram o resultado/funcionamento.

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

Status code que retornam `3xx`, como por exemplo  `301`, `302`, sao utilizados para identificar retornos de redirecionamento.

### Status Code 4xx

Status code da "Familia" `4xx` ,  identificam erros do lado do cliente no momento da requisição, como por exemplo `400` (Bad Request), `401` (Unauhtorized), `404` (Not Found) etc.

> 418: Meme to I'm teapot

### Status Code 5xx

Status Code da "familia " `5xx` identificam-se erros do lado do servidor, como por exemplo  `500` (Internal Server Error), `501` (Not Implemented), `502` (Bad Gateway).

Documentacao de Auxilio: [Mozilla MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)

## Iniciando o Projeto

### Criando um servidor

**Nativa:** A criacao de um servidor de forma nativa, utilizando funções próprias do Node não é preferível devido a complexidade no momento da criação das rotas, considere o exemplo abaixo para a criação de rotas do tipo `GET` e `POST`.

```js
const http = require('node:http')

const server = http.createServer((request, reply) => {
  if(request.url === '/users' && request.method === 'GET') {
    reply.write('Listar Usuarios')
  } else if(request.url === '/users' && request.method === 'POST') {
    reply.write('Criar Usuario')
  } else {
    reply.write('Rota não encontrada')
  }
  reply.end()
})

server.listen(3333).on('listening', () => {
  console.log('HTTP server running!')
})
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
  return []
});

server.listen({ port: 3333}).then(() => {
  console.log("HTTP Server is running!");
})
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
]

server.get("/courses", () => {
  return { courses }
});

server.get('/courses/:id', (request, reply) => {
  const courseId = request.params.id;

  const course = courses.find(course => course.id === courseId);

  if(course) {
    return reply.send({ course });
  }

  return reply.status(404).send("Course not found");
})

server.post('/courses', (request, reply) => {
  const courseId = crypto.randomUUID();
  const courseTitle = request.body.title;
  
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
server.post('/courses', (request, reply) => {
  // Tipagem mencionada no paragrafo acima
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
```

> Para rodar typescript em versões mais antigas do Node, é necessário utilizar experimental-strip-types como parâmetro do script no `npm run dev`.

**Objeto Logger**

A fim de visualizar todas as requisições da nossa API, é possivel adicionar na nossa instancia do fastify o objeto logger com valor true:

```ts
const server = fastify({ logger: true })
```

Contudo, os logs ficam feios e com leitura poluida, para melhorar essa visualização é possivel utilizar um plugin denominado `pino-pretty` do fastify. Execute o seguinte comando, e altere nossa instacia do fastify:

```sh
npm i pino-pretty
```

```ts
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
```

----

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
|-----------|---------------------------           |
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
      POSTGRES_DB: postgres
    # Portas de redirect
    ports: 
      - "5432:5432"
```

> As portas de redirect funcionam como um PORT FORWARDING a porta `5432` do postgres corresponde a porta `5432` da máquina cujo está tentando realizar o acesso também.

Para executar subir a imagem do docker com os serviços mencionados, basta executar o seguinte comando:

```sh
docker compose up
# ou para executar no modo detached (Execução em segundo plano do docker sem a necessidade do terminal aberto)
docker compose up -d
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
import { defineConfig } from 'drizzle-kit';

if(!process.env.DATABASE_URL) {
  throw new Error('The DATABASE_URL env is required')
}

export default defineConfig({
  // Used to define what is the database
  dialect: 'postgresql',
  dbCredentials: {
    // Connection string to the database
    url: process.env.DATABASE_URL,
  },
  // Folder used by Drizzle to storage automatic files
  out: './drizzle',
  // Locate table files (Schemas database)
  schema: '',
})
```

**Como criar tabelas com Drizzle?**

Para realizar a criacao de tabelas utilizando o ORM, basta seguir a seguinte estrutura:

```ts
import { uuid } from 'drizzle-orm/pg-core'
import { text } from 'drizzle-orm/pg-core'
import { pgTable } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
})
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
import { validatorCompiler, serializerCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod/v4' 

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

server.setSerializerCompiler(serializerCompiler)
server.setValidatorCompiler(validatorCompiler)

server.post("/courses", {
  schema: {
    body: z.object({
      title: z.string().min(5, 'Minimum 5 characters is required!'),
    }),
  }
}, async (request, reply) => { 
  const courseTitle = request.body.title;

  const result = await db
    .insert(courses)
    .values({ title: courseTitle })
    .returning()

  return reply.status(201).send({ courseId: result[0].id })

})
```

## Documentação

Para realizar a montagem da documentação automática utilizaremos um pacote do fastify denominado Swagger - Formato da documentação: Open API.

```sh
npm i @fastify/swagger
npm i @fastify/swagger-ui
```

No nosso arquivo `server.ts`, podemos configurar o swagger e o swagger ui da seguinte forma: 

```ts
import { fastifySwagger } from '@fastify/swagger'
import { fastifySwaggerUi } from '@fastify/swagger-ui'
import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from 'fastify-type-provider-zod'

export const server = fastify({ 
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

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Rocketseat - Desafio Node.js',
      version: '1.0.0'
    }
  },
  transform: jsonSchemaTransform
})

server.register(fastifySwaggerUi, {
  routePrefix: '/docs'
})
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
  server.get("/courses/:id", {
    schema: { 
      params: z.object({
        id: z.uuid(),
      })
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
    
    return reply.status(404).send({ message: "Course not found"})
  })
}
```

Ainda seguindo a estruturação de nossa api, podemos aprimorar nossa documentação utilizando outras propriedades no nosso schema:

```ts
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
    
    return reply.status(404).send({ message: "Course not found"})
  })
}
```

Documentação auxiliar do Swagger: [Fastify Swagger](https://www.npmjs.com/package/@fastify/swagger-ui)

### Alternativa para o SwaggerUi

> Uma alternativa para o Swagger UI é o Scalar fastify, para realizar a instalação do pacote, siga os proximos passos.

```sh
npm install @scalar/fastify-api-reference
```

Para isso poderemos remover o `swagger-ui` e seguirmos apenas com o `Scalar`, removendo importações não utilizadas e alterando as lihas de código para: 

```ts
import scalarAPIReference from "@scalar/fastify-api-reference"

server.register(scalarAPIReference, {
  routePrefix: '/docs',
})
```

> É possível realizar a configuração de temas também, caso desejado, além disso o Scalar Fastify possui um API Client que funciona como o Insomnia, Postman etc.

### Restringindo o acesso as docs

Para restringir o acesso à documentação da nossa API, nós podemos criar uma variável no arquivo `.env` e criar um condicional no arquivo `server.ts`, a partir dessa alteração, somente pessoas com acesso ao ambiente de desenvolvimento conseguirão visualizar a documentação.

```env
NODE_ENV=development
```

```ts
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
```