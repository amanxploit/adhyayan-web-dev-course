const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Get my profile
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

// Update profile
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { name, phone } = req.body;
        const updated = await User.updateUser(req.userId, { name, phone });
        
        if (!updated) {
            return res.status(400).json({ error: 'Update failed' });
        }
        
        const user = await User.findById(req.userId);
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

module.exports = router;