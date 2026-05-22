const db = require('../config/database');

class Doctor {
    static async create(doctorData) {
        const { 
            user_id, specialization, qualification, experience_years, 
            consultation_fee, available_days, available_time_start, 
            available_time_end, slot_duration, about 
        } = doctorData;
        
        const [result] = await db.execute(
            `INSERT INTO doctors (user_id, specialization, qualification, experience_years, 
             consultation_fee, available_days, available_time_start, available_time_end, 
             slot_duration, about) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, specialization, qualification, experience_years, 
             consultation_fee, available_days, available_time_start, 
             available_time_end, slot_duration || 30, about]
        );
        
        return result.insertId;
    }

    static async getAll(filters = {}) {
        let query = `
            SELECT d.*, u.name, u.email, u.phone, u.created_at 
            FROM doctors d 
            JOIN users u ON d.user_id = u.id 
            WHERE d.is_active = 1
        `;
        const params = [];
        
        if (filters.specialization) {
            query += ' AND d.specialization = ?';
            params.push(filters.specialization);
        }
        
        query += ' ORDER BY d.experience_years DESC';
        
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.execute(`
            SELECT d.*, u.name, u.email, u.phone 
            FROM doctors d 
            JOIN users u ON d.user_id = u.id 
            WHERE d.id = ?
        `, [id]);
        return rows[0];
    }

    static async getByUserId(userId) {
        const [rows] = await db.execute(`
            SELECT d.*, u.name, u.email, u.phone 
            FROM doctors d 
            JOIN users u ON d.user_id = u.id 
            WHERE d.user_id = ?
        `, [userId]);
        return rows[0];
    }

    static async getAvailableSlots(doctorId, date) {
        const doctor = await this.getById(doctorId);
        if (!doctor) return [];
        
        const [bookedSlots] = await db.execute(
            `SELECT appointment_time FROM appointments 
             WHERE doctor_id = ? AND appointment_date = ? AND status != 'cancelled'`,
            [doctorId, date]
        );
        
        const slots = [];
        const startTime = doctor.available_time_start;
        const endTime = doctor.available_time_end;
        const slotDuration = doctor.slot_duration;
        
        let currentTime = new Date(`2000-01-01 ${startTime}`);
        const endDateTime = new Date(`2000-01-01 ${endTime}`);
        
        while (currentTime < endDateTime) {
            const timeString = currentTime.toTimeString().slice(0, 5);
            const isBooked = bookedSlots.some(slot => 
                slot.appointment_time.slice(0, 5) === timeString
            );
            
            slots.push({
                time: timeString,
                isAvailable: !isBooked
            });
            
            currentTime.setMinutes(currentTime.getMinutes() + slotDuration);
        }
        
        return slots;
    }

    static async getStats() {
        const [totalDoctors] = await db.execute(
            'SELECT COUNT(*) as total FROM doctors WHERE is_active = 1'
        );
        const [totalAppointments] = await db.execute(
            'SELECT COUNT(*) as total FROM appointments'
        );
        const [totalPatients] = await db.execute(
            'SELECT COUNT(*) as total FROM users WHERE role = "patient"'
        );
        const [todayAppointments] = await db.execute(
            'SELECT COUNT(*) as total FROM appointments WHERE appointment_date = CURDATE()'
        );
        
        return {
            totalDoctors: totalDoctors[0].total,
            totalAppointments: totalAppointments[0].total,
            totalPatients: totalPatients[0].total,
            todayAppointments: todayAppointments[0].total
        };
    }
}

module.exports = Doctor;