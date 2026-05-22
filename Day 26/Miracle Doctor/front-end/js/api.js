const API_URL = 'http://localhost:5000/api';

class API {
    static setToken(token) {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }

    static getToken() {
        return localStorage.getItem('token');
    }

    static async request(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    }

    // Auth endpoints
    static async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    static async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        });
    }

    // Doctor endpoints
    static async getDoctors(filters = {}) {
        const query = new URLSearchParams(filters).toString();
        return this.request(`/doctors${query ? '?' + query : ''}`);
    }

    static async getDoctorSlots(doctorId, date) {
        return this.request(`/doctors/${doctorId}/slots?date=${date}`);
    }

    // Appointment endpoints
    static async bookAppointment(data) {
        return this.request('/appointments', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    static async getMyAppointments() {
        return this.request('/appointments/my-appointments');
    }

    static async cancelAppointment(appointmentId) {
        return this.request(`/appointments/${appointmentId}/cancel`, {
            method: 'PUT'
        });
    }

    // Admin endpoints
    static async adminGetStats() {
        return this.request('/admin/stats');
    }

    static async adminGetUsers(role = null) {
        const query = role ? `?role=${role}` : '';
        return this.request(`/admin/users${query}`);
    }

    static async adminGetDoctors() {
        return this.request('/admin/doctors');
    }

    static async adminCreateDoctor(doctorData) {
        return this.request('/admin/doctors', {
            method: 'POST',
            body: JSON.stringify(doctorData)
        });
    }

    static async adminUpdateDoctor(doctorId, doctorData) {
        return this.request(`/admin/doctors/${doctorId}`, {
            method: 'PUT',
            body: JSON.stringify(doctorData)
        });
    }

    static async adminGetAppointments(filters = {}) {
        const query = new URLSearchParams(filters).toString();
        return this.request(`/admin/appointments${query ? '?' + query : ''}`);
    }

    static async adminUpdateAppointmentStatus(appointmentId, status) {
        return this.request(`/admin/appointments/${appointmentId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });
    }

    // Profile update
    static async updateProfile(userData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }
}