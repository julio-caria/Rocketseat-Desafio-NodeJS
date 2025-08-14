# 🚀 API de Cursos - Node.js + TypeScript

Uma API REST simples e moderna construída com Node.js, TypeScript, Fastify e PostgreSQL. Ideal para estudos e como base para projetos maiores.

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando](#-executando)
- [Endpoints](#-endpoints)
- [Estrutura do Banco](#-estrutura-do-banco)
- [Fluxo da Aplicação](#-fluxo-da-aplicação)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Troubleshooting](#-troubleshooting)

## 🛠 Tecnologias

- **Runtime:** Node.js 22+
- **Framework:** Fastify 5
- **Linguagem:** TypeScript
- **ORM:** Drizzle ORM
- **Banco de Dados:** PostgreSQL
- **Validação:** Zod
- **Documentação:** Swagger/OpenAPI + Scalar API Reference
- **Containerização:** Docker & Docker Compose

## ⚙️ Pré-requisitos

- Node.js 22 ou superior
- Docker e Docker Compose
- npm (ou outro gerenciador de pacotes)

## 📦 Instalação

1. **Clone o repositório:**

   ```bash
   git clone <url-do-repositorio>
   cd Desafio-NodeJS
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

## 🔧 Configuração

1. **Suba o banco PostgreSQL:**

   ```bash
   docker compose up -d
   ```

2. **Crie o arquivo `.env` na raiz:**

   ```env
   # Configuração do banco de dados
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/desafio

   # Ambiente de desenvolvimento (ativa documentação)
   NODE_ENV=development
   ```

3. **Execute as migrações:**

   ```bash
   npm run db:migrate
   ```

4. **Opcional - Visualize o banco com Drizzle Studio:**
   ```bash
   npm run db:studio
   ```

## ▶️ Executando

```bash
npm run dev
```

- **Servidor:** http://localhost:3333
- **Documentação:** http://localhost:3333/docs (apenas em desenvolvimento)

## 🔌 Endpoints

### Criar Curso

```http
POST /courses
Content-Type: application/json

{
  "title": "Curso de Docker"
}
```

**Resposta (201):**

```json
{
  "courseId": "uuid-do-curso"
}
```

### Listar Cursos

```http
GET /courses
```

**Resposta (200):**

```json
{
  "courses": [
    {
      "id": "uuid-do-curso",
      "title": "Curso de Docker"
    }
  ]
}
```

### Buscar Curso por ID

```http
GET /courses/:id
```

**Resposta (200):**

```json
{
  "course": {
    "id": "uuid-do-curso",
    "title": "Curso de Docker",
    "description": "Descrição do curso (opcional)"
  }
}
```

**Resposta (404):** Curso não encontrado

> 💡 **Dica:** Use o arquivo `courses.http` para testar os endpoints diretamente no VS Code com extensões REST Client.

## 🗄️ Estrutura do Banco

### Tabela `courses`

| Campo         | Tipo | Descrição                               |
| ------------- | ---- | --------------------------------------- |
| `id`          | UUID | Chave primária (gerada automaticamente) |
| `title`       | TEXT | Título do curso (único, obrigatório)    |
| `description` | TEXT | Descrição do curso (opcional)           |

### Tabela `users` (exemplo para estudos)

| Campo   | Tipo | Descrição                               |
| ------- | ---- | --------------------------------------- |
| `id`    | UUID | Chave primária (gerada automaticamente) |
| `name`  | TEXT | Nome do usuário (obrigatório)           |
| `email` | TEXT | Email do usuário (único, obrigatório)   |

## 🔄 Fluxo da Aplicação

```mermaid
sequenceDiagram
  participant C as Client
  participant S as Fastify Server
  participant V as Zod Validator
  participant DB as Drizzle + PostgreSQL

  C->>S: POST /courses {title}
  S->>V: Validar body
  V-->>S: OK ou Erro 400
  alt válido
    S->>DB: INSERT INTO courses (title)
    DB-->>S: {id}
    S-->>C: 201 {courseId}
  else inválido
    S-->>C: 400
  end

  C->>S: GET /courses
  S->>DB: SELECT id,title FROM courses
  DB-->>S: lista
  S-->>C: 200 {courses: [...]}

  C->>S: GET /courses/:id
  S->>V: Validar param id (uuid)
  V-->>S: OK ou Erro 400
  alt encontrado
    S->>DB: SELECT * FROM courses WHERE id=...
    DB-->>S: course
    S-->>C: 200 {course}
  else não encontrado
    S-->>C: 404
  end
```

## 📜 Scripts Disponíveis

| Comando               | Descrição                        |
| --------------------- | -------------------------------- |
| `npm run dev`         | Inicia o servidor com hot reload |
| `npm run db:generate` | Gera artefatos do Drizzle        |
| `npm run db:migrate`  | Aplica migrações no banco        |
| `npm run db:studio`   | Abre o Drizzle Studio            |

## 🔧 Troubleshooting

### Problemas Comuns

**❌ Conexão recusada ao PostgreSQL**

```bash
# Verifique se o Docker está rodando
docker compose up -d

# Confirme que a porta 5432 não está em uso
netstat -an | grep 5432
```

**❌ Variável DATABASE_URL não encontrada**

- Verifique se o arquivo `.env` existe na raiz
- Confirme que a variável `DATABASE_URL` está definida

**❌ Documentação não aparece em `/docs`**

- Certifique-se de que `NODE_ENV=development` no `.env`
- Reinicie o servidor após alterações no `.env`

**❌ Erro nas migrações**

```bash
# Gere os artefatos primeiro
npm run db:generate

# Depois execute as migrações
npm run db:migrate
```

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

---

<div align="center">
  <p>Feito com ❤️ para estudos de Node.js e TypeScript</p>
</div>
