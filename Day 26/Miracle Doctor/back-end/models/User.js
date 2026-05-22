const db = require('../config/database');
const bcrypt = require('bcrypt');

class User {
    static async create(userData) {
        const { name, email, password, phone, role = 'patient' } = userData;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password, phone, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, role]
        );
        
        return result.insertId;
    }

    static async findByEmail(email) {
        const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.execute(
            'SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?', 
            [id]
        );
        return rows[0];
    }

    static async getAllUsers(role = null) {
        let query = 'SELECT id, name, email, phone, role, created_at FROM users';
        const params = [];
        
        if (role) {
            query += ' WHERE role = ?';
            params.push(role);
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async updateUser(id, userData) {
        const { name, phone } = userData;
        const [result] = await db.execute(
            'UPDATE users SET name = ?, phone = ? WHERE id = ?',
            [name, phone, id]
        );
        return result.affectedRows > 0;
    }

    static async deleteUser(id) {
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async validatePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User;