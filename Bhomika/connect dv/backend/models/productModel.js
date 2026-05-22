const db = require('../config/db');

const Product = {
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM products ORDER BY id DESC');
        return rows;
    },
    
    getById: async (id) => {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    },
    
    getByCategory: async (category) => {
        const [rows] = await db.query('SELECT * FROM products WHERE category = ?', [category]);
        return rows;
    },
    
    create: async (product) => {
        const { name, price, description, image, category, rating } = product;
        const [result] = await db.query(
            'INSERT INTO products (name, price, description, image, category, rating) VALUES (?, ?, ?, ?, ?, ?)',
            [name, price, description, image, category, rating || 4.5]
        );
        return result.insertId;
    },
    
    update: async (id, product) => {
        const { name, price, description, image, category, rating } = product;
        const [result] = await db.query(
            'UPDATE products SET name=?, price=?, description=?, image=?, category=?, rating=? WHERE id=?',
            [name, price, description, image, category, rating, id]
        );
        return result.affectedRows;
    },
    
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM products WHERE id = ?', [id]);
        return result.affectedRows;
    }
};

module.exports = Product;