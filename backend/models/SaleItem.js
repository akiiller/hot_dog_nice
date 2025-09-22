const db = require('../db');

class SaleItem {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM sale_items', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static getBySaleId(saleId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM sale_items WHERE sale_id = ?',
        [saleId],
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
        }
      );
    });
  }

  static create(item) {
    return new Promise((resolve, reject) => {
      const { sale_id, product_id, quantity, subtotal } = item;
      db.run(
        'INSERT INTO sale_items (sale_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)',
        [sale_id, product_id, quantity, subtotal],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, ...item });
        }
      );
    });
  }

  static deleteById(id) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM sale_items WHERE id = ?',
        [id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }
}

module.exports