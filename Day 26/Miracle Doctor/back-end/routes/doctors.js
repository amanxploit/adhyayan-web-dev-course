const express = require('express');
const router = express.Router();
const Doctor = require('../models/Doctor');
const { authMiddleware } = require('../middleware/auth');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const { specialization } = req.query;
        const doctors = await Doctor.getAll({ specialization });
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const doctor = await Doctor.getById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ error: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.get('/:id/slots', authMiddleware, async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) {
            return res.status(400).json({ error: 'Date is required' });
        }
        
        const slots = await Doctor.getAvailableSlots(req.params.id, date);
        res.json(slots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

module.exports = router;