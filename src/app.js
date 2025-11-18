const express = require('express');
const cors = require('cors');
const productsRouter = require('./routes/products');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/products', productsRouter);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API Estoque' });
});

module.exports = app;
