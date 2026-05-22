const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
    create: async (user) => {
        const { name, email, password } = user;
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        return result.insertId;
    },
    
    findByEmail: async (email) => {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    },
    
    findById: async (id) => {
        const [rows] = await db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [id]);
        return rows[0];
    }
};

module.exports = User;