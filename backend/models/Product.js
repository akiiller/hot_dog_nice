const db = require('../db');

class Product {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static create(product) {
    return new Promise((resolve, reject) => {
      const { name, price, active } = product;
      db.run(
        'INSERT INTO products (name, price, active) VALUES (?, ?, ?)',
        [name, price, active],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, ...product });
        }
      );
    });
  }

  static update(id, product) {
    return new Promise((resolve, reject) => {
      const { name, price, active } = product;
      db.run(
        'UPDATE products SET name = ?, price = ?, active = ? WHERE id = ?',
        [name, price, active, id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM products WHERE id = ?',
        [id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }
}

module.exports = Product;