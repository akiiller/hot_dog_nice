const express = require('express');
const cors = require('cors');
const app = express();

const productsRouter = require('./routes/products');
const productRecipeRouter = require('./routes/product_recipe');
const ingredientRouter = require('./routes/ingredient');
const saleItemRouter = require('./routes/sale_item');
const salesRouter = require('./routes/sales');

app.use(cors());
app.use(express.json());

// Importa as rotas
app.use('/products', productsRouter);
app.use('/product_recipes', productRecipeRouter);
app.use('/ingredients', ingredientRouter);
app.use('/sale_items', saleItemRouter);
app.use('/sales', salesRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});