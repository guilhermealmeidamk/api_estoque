API Estoque (Node.js + Express + MongoDB)

Resumo rápido

Esta é uma API de controle de estoque simples construída com Node.js, Express e Mongoose (MongoDB).

Endpoints principais

- POST /products       -> criar produto
- GET  /products       -> listar produtos
- GET  /products/:id   -> obter produto por id
- PUT  /products/:id   -> atualizar produto
- DELETE /products/:id -> deletar produto

Como rodar

1. Copie `.env.example` para `.env` e configure `MONGODB_URI` se necessário.

2. Instale dependências:

```bash
npm install
```

3. Rodar em modo desenvolvimento (nodemon):

```bash
npm run dev
```

4. Teste os endpoints (ex.: usar curl, Insomnia ou Postman). Exemplo de criação:

```bash
curl -X POST http://localhost:3000/products -H "Content-Type: application/json" -d '{"name":"Arroz","price":12.5,"quantity":10}'
```

Próximos passos sugeridos

- Validar melhor os dados (Joi ou express-validator)
- Paginação e filtros
- Autenticação (JWT)
- Testes unitários e integração
