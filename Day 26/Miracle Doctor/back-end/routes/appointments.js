const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { authMiddleware, isPatient } = require('../middleware/auth');

router.post('/', authMiddleware, isPatient, async (req, res) => {
    try {
        const { doctor_id, appointment_date, appointment_time, symptoms, notes } = req.body;
        
        if (!doctor_id || !appointment_date || !appointment_time) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        const slots = await Doctor.getAvailableSlots(doctor_id, appointment_date);
        const slot = slots.find(s => s.time === appointment_time);
        
        if (!slot || !slot.isAvailable) {
            return res.status(400).json({ error: 'Time slot is not available' });
        }
        
        const appointmentId = await Appointment.create({
            patient_id: req.userId,
            doctor_id,
            appointment_date,
            appointment_time,
            symptoms,
            notes
        });
        
        res.status(201).json({
            message: 'Appointment booked successfully',
            appointmentId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.get('/my-appointments', authMiddleware, async (req, res) => {
    try {
        let appointments;
        if (req.userRole === 'patient') {
            appointments = await Appointment.getPatientAppointments(req.userId);
        } else if (req.userRole === 'doctor') {
            const doctor = await Doctor.getByUserId(req.userId);
            if (doctor) {
                appointments = await Appointment.getDoctorAppointments(doctor.id);
            } else {
                appointments = [];
            }
        } else {
            appointments = [];
        }
        
        res.json(appointments || []);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

router.put('/:id/cancel', authMiddleware, async (req, res) => {
    try {
        const appointmentId = req.params.id;
        const appointment = await Appointment.getAppointmentById(appointmentId);
        
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        if (appointment.patient_id !== req.userId && req.userRole !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to cancel this appointment' });
        }
        
        const success = await Appointment.cancelAppointment(appointmentId);
        if (!success) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        
        res.json({ message: 'Appointment cancelled successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

module.exports = router;