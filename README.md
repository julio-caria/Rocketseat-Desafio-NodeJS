# 🚀 API de Cursos - Node.js + TypeScript

Uma API REST completa e moderna construída com Node.js, TypeScript, Fastify e PostgreSQL. Inclui autenticação JWT, testes automatizados, documentação automática e deploy automatizado.

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Funcionalidades](#-funcionalidades)
- [Pré-requisitos](#️-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando](#️-executando)
- [Testes](#-testes)
- [Endpoints](#-endpoints)
- [Autenticação](#-autenticação)
- [Estrutura do Banco](#️-estrutura-do-banco)
- [Deploy](#-deploy)
- [Scripts Disponíveis](#-scripts-disponíveis)
- [Troubleshooting](#-troubleshooting)

## 🛠 Tecnologias

- **Runtime:** Node.js 22+
- **Framework:** Fastify 5
- **Linguagem:** TypeScript
- **ORM:** Drizzle ORM
- **Banco de Dados:** PostgreSQL
- **Validação:** Zod
- **Autenticação:** JWT (JSON Web Token)
- **Criptografia:** Argon2
- **Testes:** Vitest + Supertest
- **Documentação:** Swagger/OpenAPI + Scalar API Reference
- **Containerização:** Docker & Docker Compose
- **Deploy:** Fly.io
- **Monitoramento:** Grafana

## ✨ Funcionalidades

- 🔐 **Autenticação JWT** com controle de roles (student/manager)
- 📚 **CRUD completo** de cursos
- 👥 **Sistema de usuários** com criptografia de senhas
- 🔍 **Busca e paginação** de cursos
- 📊 **Testes automatizados** com cobertura
- 📖 **Documentação automática** da API
- 📈 **Monitoramento** com métricas e logs
- 🔒 **Segurança** com validação e rate limiting

## ⚙️ Pré-requisitos

- Node.js 22 ou superior
- Docker e Docker Compose
- npm (ou outro gerenciador de pacotes)
- Conta no Fly.io (para deploy)

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
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/desafio_nodejs

   # Chave secreta para JWT (GERE UMA CHAVE FORTE!)
   JWT_SECRET=sua-chave-super-secreta-aqui

   # Ambiente de desenvolvimento (ativa documentação)
   NODE_ENV=development
   ```

3. **Execute as migrações:**

   ```bash
   npm run db:migrate
   ```

4. **Opcional - Popule o banco com dados de teste:**

   ```bash
   npm run db:seed
   ```

5. **Opcional - Visualize o banco com Drizzle Studio:**
   ```bash
   npm run db:studio
   ```

## ▶️ Executando

```bash
npm run dev
```

- **Servidor:** http://localhost:3333
- **Documentação:** http://localhost:3333/docs (apenas em desenvolvimento)

## 🧪 Testes

### Executar todos os testes:

```bash
npm test
```

### Executar testes em modo watch:

```bash
npm run test:watch
```

### Verificar cobertura de testes:

```bash
npm run test:coverage
```

### Executar testes específicos:

```bash
npm test -- --run src/routes/login.test.ts
```

## 🔌 Endpoints

### Autenticação

#### Login

```http
POST /sessions
Content-Type: application/json

{
  "email": "manager@example.com",
  "password": "123456"
}
```

**Resposta (200):**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Cursos (Requer Autenticação)

#### Criar Curso (Apenas Managers)

```http
POST /courses
Authorization: <seu-token-jwt>
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

#### Listar Cursos (Apenas Managers)

```http
GET /courses?search=docker&page=1&orderBy=title
Authorization: <seu-token-jwt>
```

**Resposta (200):**

```json
{
  "courses": [
    {
      "id": "uuid-do-curso",
      "title": "Curso de Docker",
      "enrollments": 5
    }
  ],
  "total": 1
}
```

#### Buscar Curso por ID (Todos os usuários autenticados)

```http
GET /courses/:id
Authorization: <seu-token-jwt>
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

> 💡 **Dica:** Use o arquivo `requests.http` para testar os endpoints diretamente no VS Code com extensões REST Client.

## 🔐 Autenticação

### Sistema de Roles

- **`student`**: Pode visualizar cursos
- **`manager`**: Pode criar, listar e gerenciar cursos

### Como usar a autenticação:

1. **Faça login** para obter um token JWT
2. **Inclua o token** no header `Authorization` das requisições
3. **O sistema valida** automaticamente o token e as permissões

### Exemplo de fluxo:

```bash
# 1. Login
curl -X POST http://localhost:3333/sessions \
  -H "Content-Type: application/json" \
  -d '{"email": "manager@example.com", "password": "123456"}'

# 2. Use o token retornado
curl -X GET http://localhost:3333/courses \
  -H "Authorization: <token-retornado-no-login>"
```

## 🗄️ Estrutura do Banco

### Tabela `users`

| Campo      | Tipo | Descrição                                |
| ---------- | ---- | ---------------------------------------- |
| `id`       | UUID | Chave primária (gerada automaticamente)  |
| `name`     | TEXT | Nome do usuário (obrigatório)            |
| `email`    | TEXT | Email do usuário (único, obrigatório)    |
| `password` | TEXT | Senha criptografada (obrigatório)        |
| `role`     | ENUM | Papel do usuário: 'student' ou 'manager' |

### Tabela `courses`

| Campo         | Tipo | Descrição                               |
| ------------- | ---- | --------------------------------------- |
| `id`          | UUID | Chave primária (gerada automaticamente) |
| `title`       | TEXT | Título do curso (obrigatório)           |
| `description` | TEXT | Descrição do curso (opcional)           |

### Tabela `enrollments`

| Campo      | Tipo | Descrição                               |
| ---------- | ---- | --------------------------------------- |
| `id`       | UUID | Chave primária (gerada automaticamente) |
| `userId`   | UUID | Referência ao usuário (FK)              |
| `courseId` | UUID | Referência ao curso (FK)                |

## 🚀 Deploy

### Deploy Automatizado no Fly.io

O projeto está configurado para deploy automático no Fly.io com:

- **CI/CD Pipeline** com GitHub Actions
- **Monitoramento** com Grafana
- **Métricas** em tempo real
- **Logs estruturados**

## 📜 Scripts Disponíveis

| Comando               | Descrição                        |
| --------------------- | -------------------------------- |
| `npm run dev`         | Inicia o servidor com hot reload |
| `npm run test`        | Executa todos os testes          |
| `npm run db:generate` | Gera artefatos do Drizzle        |
| `npm run db:migrate`  | Aplica migrações no banco        |
| `npm run db:seed`     | Popula banco com dados de teste  |
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

**❌ JWT_SECRET não configurado**

- Adicione `JWT_SECRET=sua-chave-secreta` no arquivo `.env`
- Gere uma chave forte: `openssl rand -base64 32`

**❌ Erro 401 - Não autorizado**

- Verifique se o token JWT está sendo enviado no header `Authorization`
- Confirme se o token não expirou
- Verifique se o usuário tem a role necessária

**❌ Documentação não aparece em `/docs`**

- Certifique-se de que `NODE_ENV=development` no `.env`
- Reinicie o servidor após alterações no `.env`

**❌ Testes falhando**

```bash
# Limpe o banco de testes
docker compose down -v
docker compose up -d

# Execute as migrações de teste
npm run pretest

# Execute os testes
npm test
```

## 📊 Cobertura de Testes

O projeto mantém alta cobertura de testes:

- **Statements:** 80.18%
- **Branches:** 76.92%
- **Functions:** 71.42%
- **Lines:** 80.18%

## 🔒 Segurança

- ✅ **Autenticação JWT** com expiração
- ✅ **Criptografia de senhas** com Argon2
- ✅ **Validação de entrada** com Zod
- ✅ **Controle de acesso** baseado em roles
- ✅ **Logs estruturados** para auditoria

## 📈 Monitoramento

- **Métricas em tempo real** via Prometheus
- **Dashboards** no Grafana
- **Logs estruturados** com Pino pretty

## 📄 Licença

Este projeto está sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

---

<div align="center">
  <p>Feito com ❤️ para estudos de Node.js e TypeScript</p>
  <p>🚀 Deploy automático | 🧪 Testes automatizados | 📊 Monitoramento em tempo real</p>
</div>
