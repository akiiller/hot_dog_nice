const db = require('../db');

class Sale {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM sales', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM sales WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static create(sale) {
    return new Promise((resolve, reject) => {
      const { date, total } = sale;
      db.run(
        'INSERT INTO sales (date, total) VALUES (?, ?)',
        [date, total],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, ...sale });
        }
      );
    });
  }

  static update(id, sale) {
    return new Promise((resolve, reject) => {
      const { date, total } = sale;
      db.run(
        'UPDATE sales SET date = ?, total = ? WHERE id = ?',
        [date, total, id],
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
        'DELETE FROM sales WHERE id = ?',
        [id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }
}

module.exports = Sale;