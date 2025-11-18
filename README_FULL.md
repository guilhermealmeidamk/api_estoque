# API Estoque (Node.js + Express + MongoDB)

## Visão geral

Esta é uma API de controle de estoque simples construída com Node.js, Express e Mongoose. Ela expõe endpoints REST para gerenciar produtos (criar, listar, obter por id, atualizar e deletar).

O repositório contém tanto uma implementação com MongoDB (Mongoose) quanto um modo "in-memory" para desenvolvimento e testes locais rápidos (sem necessidade de MongoDB).

---

## Requisitos

- Node.js >= 18 (ou sua versão local compatível)
- npm
- (Opcional) MongoDB local ou Atlas se não for usar o modo in-memory

---

## Variáveis de ambiente

Crie um arquivo `.env` a partir de `.env.example` e ajuste os valores:

- `MONGODB_URI` — string de conexão para MongoDB (ex.: `mongodb://127.0.0.1:27017/estoque`)
- `PORT` — porta onde o servidor roda (default 3000)
- `USE_IN_MEMORY` — se `true`, a API usa um repositório em memória (útil para rodar sem MongoDB)

Exemplo mínimo (`.env`):

```env
MONGODB_URI=mongodb://127.0.0.1:27017/estoque
PORT=3000
USE_IN_MEMORY=false
```

Se quiser testar sem MongoDB, ajuste `USE_IN_MEMORY=true` (ou exporte a variável antes de rodar):

```bash
export USE_IN_MEMORY=true
```

---

## Instalação e execução

Instale dependências:

```bash
npm install
```

Rodar em desenvolvimento (usa `nodemon`):

```bash
npm run dev
```

Rodar em produção:

```bash
npm start
```

Observação: se `USE_IN_MEMORY` estiver `false` (ou não definida), o servidor tentará conectar ao MongoDB antes de iniciar; se a conexão falhar o processo sai com erro.

---

## Modelo de dados (Product)

O recurso principal desta API é `Product`. Este é o shape/ esquema esperado quando você cria/atualiza um produto.

- `name` (string) — obrigatório
- `sku` (string) — opcional (código de produto)
- `price` (number) — obrigatório (>= 0)
- `quantity` (number) — opcional, padrão `0` (>= 0)
- `category` (string) — opcional

Exemplo de objeto `Product` válido (JSON):

```json
{
  "name": "Arroz Tipo 1",
  "sku": "ARZ-001",
  "price": 12.5,
  "quantity": 10,
  "category": "Grãos"
}
```

Resposta do servidor ao criar um produto (exemplo):

```json
{
  "_id": "655e1f5b3c9a9f001234abcd",
  "name": "Arroz Tipo 1",
  "sku": "ARZ-001",
  "price": 12.5,
  "quantity": 10,
  "category": "Grãos",
  "createdAt": "2025-11-17T12:00:00.000Z",
  "updatedAt": "2025-11-17T12:00:00.000Z",
  "__v": 0
}
```

---

## Endpoints (API Reference)

Base URL: `http://localhost:3000` (ou `{{baseUrl}}` se usar variável de environment no Postman)

### 1) Criar produto

- Method: POST
- Path: `/products`
- Headers: `Content-Type: application/json`
- Body: JSON com os campos de `Product` (veja acima). Os campos obrigatórios são `name` e `price`.
- Success: 201 Created — retorna o objeto criado (incluindo `_id`).
- Erros comuns:
  - 400 Bad Request — payload inválido (por ex., price não numérico, name faltando)

Exemplo curl:

```bash
curl -s -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Arroz","sku":"ARZ-001","price":12.5,"quantity":10,"category":"Grãos"}'
```

---

### 2) Listar produtos

- Method: GET
- Path: `/products`
- Success: 200 OK — retorna um array JSON com todos os produtos.
- Nota: atualmente sem paginação; para muitos itens, recomendamos adicionar query params `?page=1&limit=20` no futuro.

Exemplo curl:

```bash
curl -s http://localhost:3000/products
```

---

### 3) Obter produto por id

- Method: GET
- Path: `/products/:id`
- Success: 200 OK — retorna o objeto do produto
- Erros:
  - 404 Not Found — id inexistente

Exemplo curl:

```bash
curl -s http://localhost:3000/products/<PRODUCT_ID>
```

---

### 4) Atualizar produto

- Method: PUT
- Path: `/products/:id`
- Headers: `Content-Type: application/json`
- Body: JSON com os campos a alterar (pode enviar apenas um subconjunto, ex.: `{ "price": 13.0 }`).
- Success: 200 OK — retorna o objeto atualizado.
- Erros:
  - 400 Bad Request — corpo inválido
  - 404 Not Found — id inexistente

Exemplo curl:

```bash
curl -s -X PUT http://localhost:3000/products/<PRODUCT_ID> \
  -H "Content-Type: application/json" \
  -d '{"price":13.0}'
```

---

### 5) Deletar produto

- Method: DELETE
- Path: `/products/:id`
- Success: 204 No Content — operação concluída, sem corpo de resposta.
- Erros:
  - 404 Not Found — id inexistente

Exemplo curl:

```bash
curl -s -X DELETE http://localhost:3000/products/<PRODUCT_ID>
```

---

## Testes automáticos no Postman (scripts básicos)

Sugestão: crie um Environment no Postman com a variável `baseUrl = http://localhost:3000` e `productId` vazia.

- POST /products (aba Tests):

```javascript
pm.test("Status is 201", () => pm.response.to.have.status(201));
const json = pm.response.json();
pm.environment.set("productId", json._id);
```

- GET /products (Tests):

```javascript
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("Response is array", () => pm.expect(pm.response.json()).to.be.an('array'));
```

- GET /products/:id (Tests):

```javascript
pm.test("Status is 200", () => pm.response.to.have.status(200));
pm.test("IDs match", () => pm.expect(pm.response.json()._id).to.eql(pm.environment.get('productId')));
```

- PUT /products/:id (Tests):

```javascript
pm.test("Status is 200", () => pm.response.to.have.status(200));
```

- DELETE /products/:id (Tests):

```javascript
pm.test("Status is 204", () => pm.response.to.have.status(204));
pm.environment.unset('productId');
```

Você pode agrupar os requests em uma Collection e usar o Collection Runner para executar a sequência (create -> list -> get -> update -> delete).

---

## Rodando sem MongoDB (modo in-memory)

Para desenvolvimento rápido sem instalar MongoDB localmente, use `USE_IN_MEMORY=true`:

```bash
export USE_IN_MEMORY=true
npm run dev
```

Nesse modo os dados são salvos apenas na memória do processo e são perdidos quando o servidor for parado. É ótimo para smoke tests e integração com CI leve.

---

## Boas práticas e próximos passos sugeridos

- Adicionar validação de entrada (ex.: `Joi` ou `express-validator`).
- Implementar paginação, ordenação e filtros em `GET /products`.
- Adicionar autenticação (por exemplo, JWT) para proteger rotas de escrita.
- Adicionar testes automatizados (Jest + supertest).
- Documentar com OpenAPI/Swagger para gerar documentação interativa.

---

## Contato

Se quiser, eu posso gerar uma Postman Collection (`postman_collection_estoque.json`) pronta para importar — diga se prefere que eu gere o arquivo no repositório.

Obrigado — bons testes!
