const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = 'your-secret-key-change-this';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// File paths
const productsPath = path.join(__dirname, 'products.json');
const usersPath = path.join(__dirname, 'users.json');

// Helper functions
const readProducts = () => JSON.parse(fs.readFileSync(productsPath, 'utf8'));
const readUsers = () => JSON.parse(fs.readFileSync(usersPath, 'utf8'));
const writeUsers = (data) => fs.writeFileSync(usersPath, JSON.stringify(data, null, 2));

// Authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access token required' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

// ============= PRODUCT API ROUTES =============

// Get all products with filtering
app.get('/api/products', (req, res) => {
    const productsData = readProducts();
    let { products } = productsData;
    const { category, search, minPrice, maxPrice, sort } = req.query;

    // Filter by category
    if (category && category !== 'all') {
        products = products.filter(p => p.category === category);
    }

    // Search products
    if (search) {
        products = products.filter(p => 
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.brand.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Filter by price
    if (minPrice) {
        products = products.filter(p => p.price >= parseInt(minPrice));
    }
    if (maxPrice) {
        products = products.filter(p => p.price <= parseInt(maxPrice));
    }

    // Sort products
    if (sort) {
        switch(sort) {
            case 'price-low':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                products.sort((a, b) => b.rating - a.rating);
                break;
            case 'discount':
                products.sort((a, b) => b.discount - a.discount);
                break;
            default:
                products.sort((a, b) => a.id - b.id);
        }
    }

    res.json({
        success: true,
        products,
        total: products.length,
        categories: productsData.categories
    });
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
    const productsData = readProducts();
    const product = productsData.products.find(p => p.id === parseInt(req.params.id));
    
    if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.json({ success: true, product });
});

// Get featured products
app.get('/api/featured', (req, res) => {
    const productsData = readProducts();
    const featured = productsData.products.filter(p => 
        productsData.featuredProducts.includes(p.id)
    );
    res.json({ success: true, products: featured });
});

// Get products by category
app.get('/api/categories/:category', (req, res) => {
    const productsData = readProducts();
    const products = productsData.products.filter(p => 
        p.category === req.params.category
    );
    res.json({ success: true, products });
});

// ============= USER & AUTH API ROUTES =============

// Register user
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, phone } = req.body;
    const usersData = readUsers();

    // Check if user exists
    if (usersData.users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
        id: usersData.users.length + 1,
        name,
        email,
        password: hashedPassword,
        phone,
        addresses: [],
        cart: [],
        orders: [],
        wishlist: []
    };

    usersData.users.push(newUser);
    writeUsers(usersData);

    // Generate token
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET_KEY, { expiresIn: '7d' });

    res.json({
        success: true,
        message: 'Registration successful',
        token,
        user: { id: newUser.id, name: newUser.name, email: newUser.email }
    });
});

// Login user
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const usersData = readUsers();
    
    const user = usersData.users.find(u => u.email === email);
    
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '7d' });
    
    res.json({
        success: true,
        message: 'Login successful',
        token,
        user: { id: user.id, name: user.name, email: user.email }
    });
});

// Get user profile
app.get('/api/user/profile', authenticateToken, (req, res) => {
    const usersData = readUsers();
    const user = usersData.users.find(u => u.id === req.user.id);
    
    if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const { password, ...userData } = user;
    res.json({ success: true, user: userData });
});

// ============= CART API ROUTES =============

// Get user cart
app.get('/api/cart', authenticateToken, (req, res) => {
    const usersData = readUsers();
    const user = usersData.users.find(u => u.id === req.user.id);
    const productsData = readProducts();
    
    const cartItems = user.cart.map(item => {
        const product = productsData.products.find(p => p.id === item.productId);
        return {
            ...item,
            product: product,
            totalPrice: product.price * item.quantity
        };
    });
    
    const total = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    
    res.json({ success: true, cart: cartItems, total });
});

// Add to cart
app.post('/api/cart/add', authenticateToken, (req, res) => {
    const { productId, quantity = 1 } = req.body;
    const usersData = readUsers();
    const userIndex = usersData.users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
        return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    const existingItem = usersData.users[userIndex].cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        usersData.users[userIndex].cart.push({ productId, quantity });
    }
    
    writeUsers(usersData);
    res.json({ success: true, message: 'Product added to cart' });
});

// Update cart item quantity
app.put('/api/cart/update', authenticateToken, (req, res) => {
    const { productId, quantity } = req.body;
    const usersData = readUsers();
    const userIndex = usersData.users.findIndex(u => u.id === req.user.id);
    
    const cartItem = usersData.users[userIndex].cart.find(item => item.productId === productId);
    
    if (cartItem) {
        if (quantity <= 0) {
            usersData.users[userIndex].cart = usersData.users[userIndex].cart.filter(
                item => item.productId !== productId
            );
        } else {
            cartItem.quantity = quantity;
        }
        writeUsers(usersData);
        res.json({ success: true, message: 'Cart updated' });
    } else {
        res.status(404).json({ success: false, message: 'Item not found in cart' });
    }
});

// Remove from cart
app.delete('/api/cart/remove/:productId', authenticateToken, (req, res) => {
    const usersData = readUsers();
    const userIndex = usersData.users.findIndex(u => u.id === req.user.id);
    
    usersData.users[userIndex].cart = usersData.users[userIndex].cart.filter(
        item => item.productId !== parseInt(req.params.productId)
    );
    
    writeUsers(usersData);
    res.json({ success: true, message: 'Product removed from cart' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 E-commerce server running on http://localhost:${PORT}`);
    console.log(`📦 API endpoints available at http://localhost:${PORT}/api`);
});