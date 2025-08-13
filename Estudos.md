# Rocketseat - NodeJS

O projeto em questao e voltado para o desenvolvimento de uma API completa, utilizando NodeJS, conhecendo os principais fundamentos, incluindo updates do ecossistema do NodeJS.

## Cronograma

1. Aula 01 - Fundamentos de API, Status Code, NodeJS.
2. Aula 02 - Funcionalidades essenciais para o sistema, CRUD e estrutura de banco, Docker, Postgres.
3. Aula 03 - Testes Automatizados
4. Aula  04 - Deploy do Projeto, Finalizacao

## Fundamentos

- JSON
- API
- Rest
- URL
- Tipos de dados
- HTTP Status Code

> SSR - Server-Side Rendering: Back-end retornava o Front com a resposta da requisicao

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

- `GET`: Buscar informacoes de uma entidade
- `POST`: Solicitar criacao de alguma informacao em nosso banco de dados
- `PUT`: Atualizar todas as informacoes de uma entidade
- `DELETE`: Excluir uma informacao do nosso banco de dados
- `PATCH`: Atualizar uma unica informacao da nossa entidade
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

> OBS.: Quando utilizamos o Query Params, as informacoes ficam expostas diretamente na URL, o que pode ser considerada uma falha de seguranca a depender da requisicao realizada.

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
  - Metadados:  Informacoes adicionais que nao alteram o resultado/funcionamento.

```sh
POST  localhost:3333/users

# Forma como o back-end vai retornar a informacao
HEADER -> Accept-Language: en
{ message: "Usuario nao existe" }
```

## HTTP Status Code

Toda requisicao enviada para o Backend retorna um `HTTP Status Code`, utilizados para identificar o tipo de retorno.

### Status Code 2xx

Status que retornam `2xx`, como por exemplo `200` (OK), `201` (Created), `202` (Accepted - API Processou porém não garante que foi criado) identificam que uma requisicao foi bem sucedida.

### Status Code 3xx

Status code que retornam `3xx`, como por exemplo  `301`, `302`, sao utilizados para identificar retornos de redirecionamento.

### Status Code 4xx

Status code da "Familia" `4xx` ,  identificam erros do lado do cliente no momento da requisicao, como por exemplo `400` (Bad Request), `401` (Unauhtorized), `404` (Not Found) etc.

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

Contudo, para as aulas em questao, estaremos utilizando o `fastify`, por ser um microframework mais eficiente e com um suporte melhor

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
