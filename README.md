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

Status que retornam `2xx`, como por exemplo `200` (Success), `201` (Created), `202` (Accepted) identificam que uma requisicao foi bem sucedida.

### Status Code 3xx

Status code que retornam `3xx`, como por exemplo  `301`, `302`, sao utilizados para identificar retornos de redirecionamento.

### Status Code 4xx

Status code da "Familia" `4xx` ,  identificam erros do lado do cliente no momento da requisicao, como por exemplo `400` (Bad Request), `401` (Unauhtorized), `404` (Not Found) etc.

### Status Code 5xx

Status Code da "familia " `5xx` identificam-se erros do lado do servidor, como por exemplo  `500` (Internal Server Error), `501` (Not Implemented), `502` (Bad Gateway).

Documentacao de Auxilio: [Mozilla MDN](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status)