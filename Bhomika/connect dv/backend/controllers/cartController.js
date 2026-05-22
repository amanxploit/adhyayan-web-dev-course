const Cart = require('../models/cartModel');

const cartController = {
    getCart: async (req, res) => {
        try {
            const userId = req.userId;
            const cartItems = await Cart.getByUser(userId);
            res.json(cartItems);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    addToCart: async (req, res) => {
        try {
            const userId = req.userId;
            const { productId, quantity } = req.body;
            await Cart.addItem(userId, productId, quantity || 1);
            res.json({ success: true, message: 'Item added to cart' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    removeFromCart: async (req, res) => {
        try {
            const userId = req.userId;
            const { productId } = req.params;
            await Cart.removeItem(userId, productId);
            res.json({ success: true, message: 'Item removed from cart' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    updateCartItem: async (req, res) => {
        try {
            const userId = req.userId;
            const { productId } = req.params;
            const { quantity } = req.body;
            await Cart.updateQuantity(userId, productId, quantity);
            res.json({ success: true, message: 'Cart updated' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = cartController;