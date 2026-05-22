const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');

router.post('/register', [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty().trim(),
    body('phone').optional().trim()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        
        const existingUser = await User.findByEmail(req.body.email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        const userId = await User.create(req.body);
        const user = await User.findById(userId);
        
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        res.status(201).json({
            message: 'Registration successful',
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const isValid = await User.validatePassword(password, user.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: process.env.JWT_EXPIRE || '7d' }
        );
        
        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

module.exports = router;