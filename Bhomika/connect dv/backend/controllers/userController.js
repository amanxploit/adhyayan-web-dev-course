const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userController = {
    register: async (req, res) => {
        try {
            const { name, email, password } = req.body;
            
            const existingUser = await User.findByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            
            const userId = await User.create({ name, email, password });
            const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            
            res.status(201).json({ 
                success: true,
                message: 'User registered successfully',
                token,
                user: { id: userId, name, email }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
    
    login: async (req, res) => {
        try {
            const { email, password } = req.body;
            const user = await User.findByEmail(email);
            
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            
            const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
            
            res.json({
                success: true,
                message: 'Login successful',
                token,
                user: { id: user.id, name: user.name, email: user.email }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
};

module.exports = userController;