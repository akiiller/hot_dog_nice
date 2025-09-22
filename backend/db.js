const sqlite3 = require('sqlite3');
const { open } = require('sqlite3');

async function setup() {
  const db = new sqlite3.Database('./cachorro_quente.db', (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
  }});
  
  db.exec('PRAGMA foreign_keys = ON;');

  db.exec(`
    -- Tabela de Produtos (o que você vende)
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      price REAL NOT NULL,
      active BOOLEAN DEFAULT TRUE
    );

    -- Tabela de Insumos (o que você usa para produzir)
    CREATE TABLE IF NOT EXISTS ingredients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      current_quantity REAL NOT NULL,
      unit_of_measure TEXT NOT NULL, -- Ex: 'un', 'kg', 'L'
      min_quantity REAL DEFAULT 0
    );

    -- Tabela de Receitas (conecta Produtos com Insumos)
    CREATE TABLE IF NOT EXISTS product_recipes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      ingredient_id INTEGER NOT NULL,
      quantity_used REAL NOT NULL,
      FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE,
      FOREIGN KEY (ingredient_id) REFERENCES ingredients (id) ON DELETE CASCADE
    );

    -- Tabela de Vendas
    CREATE TABLE IF NOT EXISTS sales (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      total_amount REAL NOT NULL,
      payment_method TEXT NOT NULL,
      sale_time TEXT NOT NULL
    );

    -- Tabela de Itens da Venda (conecta Vendas com Produtos)
    CREATE TABLE IF NOT EXISTS sale_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sale_id INTEGER NOT NULL,
      product_id INTEGER NOT NULL,
      quantity INTEGER NOT NULL,
      unit_price REAL NOT NULL,
      subtotal REAL NOT NULL,
      FOREIGN KEY (sale_id) REFERENCES sales (id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products (id)
    );
  `);

  // Insere dados iniciais apenas se as tabelas estiverem vazias
  const productCount = await db.get('SELECT COUNT(id) as count FROM products');
  if (productCount.count === 0) {
    await db.run('INSERT INTO products (name, price) VALUES (?, ?)', ['Hot-Dog Simples', 8.50]);
    await db.run('INSERT INTO products (name, price) VALUES (?, ?)', ['Hot-Dog Completo', 12.00]);
    await db.run('INSERT INTO products (name, price) VALUES (?, ?)', ['Coca-Cola Lata', 5.00]);
    await db.run('INSERT INTO products (name, price) VALUES (?, ?)', ['Guaraná Lata', 4.50]);
  }

  const ingredientCount = await db.get('SELECT COUNT(id) as count FROM ingredients');
  if (ingredientCount.count === 0) {
    await db.run('INSERT INTO ingredients (name, current_quantity, unit_of_measure) VALUES (?, ?, ?)', ['Pão de Hot-Dog', 50, 'un']);
    await db.run('INSERT INTO ingredients (name, current_quantity, unit_of_measure) VALUES (?, ?, ?)', ['Salsicha', 100, 'un']);
    await db.run('INSERT INTO ingredients (name, current_quantity, unit_of_measure) VALUES (?, ?, ?)', ['Molho de Tomate', 5, 'kg']);
  }
  
  console.log('Banco de dados configurado com sucesso.');
  return db;
}

module.exports = setup;

