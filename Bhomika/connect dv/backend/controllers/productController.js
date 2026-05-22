const Product = require('../models/productModel');

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Product.getAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    getProductById: async (req, res) => {
        try {
            const product = await Product.getById(req.params.id);
            if (!product) return res.status(404).json({ error: 'Product not found' });
            res.json(product);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    createProduct: async (req, res) => {
        try {
            const id = await Product.create(req.body);
            res.status(201).json({ id, message: 'Product created successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    updateProduct: async (req, res) => {
        try {
            const affected = await Product.update(req.params.id, req.body);
            if (affected === 0) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product updated successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    deleteProduct: async (req, res) => {
        try {
            const affected = await Product.delete(req.params.id);
            if (affected === 0) return res.status(404).json({ error: 'Product not found' });
            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = productController;