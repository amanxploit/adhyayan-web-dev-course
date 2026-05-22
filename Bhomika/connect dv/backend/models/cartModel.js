const db = require('../config/db');

const Cart = {
    getByUser: async (userId) => {
        const [rows] = await db.query(
            `SELECT c.id, c.user_id, c.product_id, c.quantity, 
                    p.name, p.price, p.image, p.category
             FROM cart c 
             JOIN products p ON c.product_id = p.id 
             WHERE c.user_id = ?`,
            [userId]
        );
        return rows;
    },
    
    addItem: async (userId, productId, quantity = 1) => {
        const [existing] = await db.query(
            'SELECT * FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        
        if (existing.length > 0) {
            const [result] = await db.query(
                'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
                [quantity, userId, productId]
            );
            return result;
        } else {
            const [result] = await db.query(
                'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
                [userId, productId, quantity]
            );
            return result;
        }
    },
    
    removeItem: async (userId, productId) => {
        const [result] = await db.query(
            'DELETE FROM cart WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        return result.affectedRows;
    },
    
    updateQuantity: async (userId, productId, quantity) => {
        const [result] = await db.query(
            'UPDATE cart SET quantity = ? WHERE user_id = ? AND product_id = ?',
            [quantity, userId, productId]
        );
        return result.affectedRows;
    },
    
    clearCart: async (userId) => {
        const [result] = await db.query('DELETE FROM cart WHERE user_id = ?', [userId]);
        return result.affectedRows;
    }
};

module.exports = Cart;