const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');
const { authMiddleware, isAdmin } = require('../middleware/auth');

router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
    try {
        const stats = await Doctor.getStats();
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.get('/users', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { role } = req.query;
        const users = await User.getAllUsers(role);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.post('/doctors', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { 
            name, email, password, phone, specialization, qualification, 
            experience_years, consultation_fee, available_days, 
            available_time_start, available_time_end, about 
        } = req.body;
        
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }
        
        const userId = await User.create({
            name, email, password, phone, role: 'doctor'
        });
        
        await Doctor.create({
            user_id: userId, specialization, qualification, experience_years,
            consultation_fee, available_days, available_time_start, available_time_end, about
        });
        
        res.status(201).json({ message: 'Doctor created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.get('/doctors', authMiddleware, isAdmin, async (req, res) => {
    try {
        const doctors = await Doctor.getAll();
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.get('/appointments', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { status, date } = req.query;
        const appointments = await Appointment.getAllAppointments({ status, date });
        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.put('/appointments/:id/status', authMiddleware, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        const appointmentId = req.params.id;
        
        const updated = await Appointment.updateStatus(appointmentId, status);
        
        if (!updated) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        res.json({ message: 'Appointment status updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

module.exports = router;