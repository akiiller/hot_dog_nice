const db = require('../db');

class Ingredient {
  static getAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM ingredients', [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      });
    });
  }

  static getById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM ingredients WHERE id = ?', [id], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });
  }

  static create(ingredient) {
    return new Promise((resolve, reject) => {
      const { name, unit, stock } = ingredient;
      db.run(
        'INSERT INTO ingredients (name, unit, stock) VALUES (?, ?, ?)',
        [name, unit, stock],
        function (err) {
          if (err) return reject(err);
          resolve({ id: this.lastID, ...ingredient });
        }
      );
    });
  }

  static update(id, ingredient) {
    return new Promise((resolve, reject) => {
      const { name, unit, stock } = ingredient;
      db.run(
        'UPDATE ingredients SET name = ?, unit = ?, stock = ? WHERE id = ?',
        [name, unit, stock, id],
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
        'DELETE FROM ingredients WHERE id = ?',
        [id],
        function (err) {
          if (err) return reject(err);
          resolve(this.changes > 0);
        }
      );
    });
  }
}

module.exports = Ingredient;