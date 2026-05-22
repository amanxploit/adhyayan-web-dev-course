const db = require('../config/database');

class Appointment {
    static async create(appointmentData) {
        const { patient_id, doctor_id, appointment_date, appointment_time, symptoms, notes } = appointmentData;
        
        const [result] = await db.execute(
            `INSERT INTO appointments (patient_id, doctor_id, appointment_date, appointment_time, symptoms, notes) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [patient_id, doctor_id, appointment_date, appointment_time, symptoms || null, notes || null]
        );
        
        return result.insertId;
    }

    static async getPatientAppointments(patientId) {
        const [rows] = await db.execute(`
            SELECT a.*, d.specialization, u.name as doctor_name, u.phone as doctor_phone,
                   d.consultation_fee
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users u ON d.user_id = u.id
            WHERE a.patient_id = ?
            ORDER BY a.appointment_date DESC, a.appointment_time DESC
        `, [patientId]);
        return rows;
    }

    static async getDoctorAppointments(doctorId, status = null) {
        let query = `
            SELECT a.*, u.name as patient_name, u.email as patient_email, u.phone as patient_phone
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            WHERE a.doctor_id = ?
        `;
        const params = [doctorId];
        
        if (status) {
            query += ' AND a.status = ?';
            params.push(status);
        }
        
        query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';
        
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async getAllAppointments(filters = {}) {
        let query = `
            SELECT a.*, 
                   u.name as patient_name, u.email as patient_email,
                   d.specialization, doc.name as doctor_name
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users doc ON d.user_id = doc.id
            WHERE 1=1
        `;
        const params = [];
        
        if (filters.status) {
            query += ' AND a.status = ?';
            params.push(filters.status);
        }
        
        if (filters.date) {
            query += ' AND a.appointment_date = ?';
            params.push(filters.date);
        }
        
        query += ' ORDER BY a.appointment_date DESC, a.appointment_time DESC';
        
        const [rows] = await db.execute(query, params);
        return rows;
    }

    static async updateStatus(appointmentId, status) {
        const [result] = await db.execute(
            'UPDATE appointments SET status = ? WHERE id = ?',
            [status, appointmentId]
        );
        return result.affectedRows > 0;
    }

    static async cancelAppointment(appointmentId) {
        return await this.updateStatus(appointmentId, 'cancelled');
    }

    static async getAppointmentById(id) {
        const [rows] = await db.execute(`
            SELECT a.*, u.name as patient_name, u.email as patient_email, u.phone as patient_phone,
                   doc.name as doctor_name, d.specialization, d.consultation_fee
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            JOIN doctors d ON a.doctor_id = d.id
            JOIN users doc ON d.user_id = doc.id
            WHERE a.id = ?
        `, [id]);
        return rows[0];
    }
}

module.exports = Appointment;