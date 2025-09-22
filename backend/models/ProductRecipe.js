const db = require('../db');

class ProductRecipe {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM product_recipes', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static getByProductId(productId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM product_recipes WHERE product_id = ?',
        [productId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static create(recipe) {
    return new Promise((resolve, reject) => {
      const { product_id, ingredient_id, quantity } = recipe;
      db.run(
        'INSERT INTO product_recipes (product_id, ingredient_id, quantity) VALUES (?, ?, ?)',
        [product_id, ingredient_id, quantity],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, ...recipe });
        }
      );
    });
  }

  static deleteById(id) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM product_recipes WHERE id = ?',
        [id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }
}

module.exports = ProductRecipe;
        