const express = require('express');
const cors = require('cors');
const setupDatabase = require('./db');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

async function startServer() {
  const db = await setupDatabase();

  // --- ROTAS CRUD PARA PRODUTOS ---

  // Criar um novo produto
  app.post('/api/products', async (req, res) => {
    const { name, price } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    }
    try {
      const result = await db.run('INSERT INTO products (name, price) VALUES (?, ?)', [name, price]);
      res.status(201).json({ id: result.lastID, name, price, active: true });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar produto', details: error.message });
    }
  });

  // Ler todos os produtos (ativos e inativos)
  app.get('/api/products/all', async (req, res) => {
    try {
      const products = await db.all('SELECT * FROM products');
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar todos os produtos' });
    }
  });
  
  // Ler apenas produtos ativos (para o PDV)
  app.get('/api/products', async (req, res) => {
    try {
      const products = await db.all('SELECT * FROM products WHERE active = TRUE');
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar produtos ativos' });
    }
  });

  // Atualizar um produto
  app.put('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, price, active } = req.body;
    try {
      await db.run(
        'UPDATE products SET name = ?, price = ?, active = ? WHERE id = ?',
        [name, price, active, id]
      );
      res.json({ id, name, price, active });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar produto', details: error.message });
    }
  });

  // Deletar um produto (desativar)
  app.delete('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.run('UPDATE products SET active = FALSE WHERE id = ?', [id]);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar produto' });
    }
  });

  // --- ROTAS CRUD PARA INSUMOS (INGREDIENTS) ---

  // Criar um novo insumo
  app.post('/api/ingredients', async (req, res) => {
    const { name, current_quantity, unit_of_measure, min_quantity } = req.body;
    try {
      const result = await db.run(
        'INSERT INTO ingredients (name, current_quantity, unit_of_measure, min_quantity) VALUES (?, ?, ?, ?)',
        [name, current_quantity, unit_of_measure, min_quantity]
      );
      res.status(201).json({ id: result.lastID, ...req.body });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar insumo', details: error.message });
    }
  });

  // Ler todos os insumos
  app.get('/api/ingredients', async (req, res) => {
    try {
      const ingredients = await db.all('SELECT * FROM ingredients');
      res.json(ingredients);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar insumos' });
    }
  });

  // Atualizar um insumo
  app.put('/api/ingredients/:id', async (req, res) => {
    const { id } = req.params;
    const { name, current_quantity, unit_of_measure, min_quantity } = req.body;
    try {
      await db.run(
        'UPDATE ingredients SET name = ?, current_quantity = ?, unit_of_measure = ?, min_quantity = ? WHERE id = ?',
        [name, current_quantity, unit_of_measure, min_quantity, id]
      );
      res.json({ id, ...req.body });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao atualizar insumo', details: error.message });
    }
  });

  // Deletar um insumo
  app.delete('/api/ingredients/:id', async (req, res) => {
    const { id } = req.params;
    try {
      await db.run('DELETE FROM ingredients WHERE id = ?', [id]);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: 'Erro ao deletar insumo' });
    }
  });
  
  // --- ROTAS PARA VENDAS (EXISTENTES) ---
  app.post('/api/sales', async (req, res) => {
    const { totalAmount, paymentMethod, items } = req.body;
    if (!totalAmount || !paymentMethod || !items || items.length === 0) {
      return res.status(400).json({ error: 'Dados da venda incompletos.' });
    }
    try {
      await db.exec('BEGIN TRANSACTION');
      const saleResult = await db.run(
        'INSERT INTO sales (total_amount, payment_method, sale_time) VALUES (?, ?, ?)',
        [totalAmount, paymentMethod, new Date().toISOString()]
      );
      const saleId = saleResult.lastID;
      const stmt = await db.prepare(
        'INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)'
      );
      for (const item of items) {
        await stmt.run(saleId, item.product.id, item.quantity, item.product.price, item.subtotal);
      }
      await stmt.finalize();
      await db.exec('COMMIT');
      res.status(201).json({ message: 'Venda registrada com sucesso!', saleId });
    } catch (error) {
      await db.exec('ROLLBACK');
      res.status(500).json({ error: 'Erro ao registrar venda', details: error.message });
    }
  });

  app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
  });
}

startServer();

