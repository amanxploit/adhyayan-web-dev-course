let appointmentsChart = null;

// Check authentication
if (!API.getToken()) {
    window.location.href = 'index.html';
}

const user = JSON.parse(localStorage.getItem('user') || '{}');

// Check if user is admin
if (user.role !== 'admin') {
    alert('Access denied. Admin only.');
    window.location.href = 'dashboard.html';
}

// Load dashboard data
loadStats();
loadAppointmentsChart();

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(`${sectionName}-section`).classList.remove('hidden');
    
    // Load data based on section
    switch(sectionName) {
        case 'appointments':
            loadAllAppointments();
            break;
        case 'doctors':
            loadAllDoctors();
            break;
        case 'patients':
            loadAllPatients();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

async function loadStats() {
    try {
        const stats = await API.adminGetStats();
        const container = document.getElementById('stats-container');
        
        container.innerHTML = `
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-blue-100 rounded-full">
                        <i class="fas fa-user-md text-2xl text-blue-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500">Total Doctors</p>
                        <p class="text-2xl font-bold">${stats.totalDoctors || 0}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-green-100 rounded-full">
                        <i class="fas fa-users text-2xl text-green-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500">Total Patients</p>
                        <p class="text-2xl font-bold">${stats.totalPatients || 0}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-yellow-100 rounded-full">
                        <i class="fas fa-calendar-check text-2xl text-yellow-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500">Total Appointments</p>
                        <p class="text-2xl font-bold">${stats.totalAppointments || 0}</p>
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-3 bg-purple-100 rounded-full">
                        <i class="fas fa-calendar-day text-2xl text-purple-600"></i>
                    </div>
                    <div class="ml-4">
                        <p class="text-gray-500">Today's Appointments</p>
                        <p class="text-2xl font-bold">${stats.todayAppointments || 0}</p>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

async function loadAppointmentsChart() {
    try {
        const appointments = await API.adminGetAppointments();
        
        // Process data for chart
        const statusCounts = {
            pending: 0,
            confirmed: 0,
            completed: 0,
            cancelled: 0
        };
        
        appointments.forEach(app => {
            statusCounts[app.status]++;
        });
        
        const ctx = document.getElementById('appointmentsChart').getContext('2d');
        
        if (appointmentsChart) {
            appointmentsChart.destroy();
        }
        
        appointmentsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
                datasets: [{
                    label: 'Number of Appointments',
                    data: [statusCounts.pending, statusCounts.confirmed, statusCounts.completed, statusCounts.cancelled],
                    backgroundColor: ['#fbbf24', '#34d399', '#60a5fa', '#f87171'],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error loading chart:', error);
    }
}

async function loadAllAppointments() {
    try {
        const status = document.getElementById('status-filter')?.value || '';
        const filters = status ? { status } : {};
        const appointments = await API.adminGetAppointments(filters);
        
        const container = document.getElementById('appointments-list');
        
        if (!appointments.length) {
            container.innerHTML = '<div class="text-center py-8 text-gray-500">No appointments found</div>';
            return;
        }
        
        container.innerHTML = appointments.map(app => `
            <div class="p-4 hover:bg-gray-50">
                <div class="flex justify-between items-start">
                    <div>
                        <p class="font-semibold">${app.patient_name}</p>
                        <p class="text-sm text-gray-600">Dr. ${app.doctor_name} - ${app.specialization}</p>
                        <p class="text-sm text-gray-500">${app.appointment_date} at ${app.appointment_time}</p>
                    </div>
                    <div class="text-right">
                        <select onchange="updateAppointmentStatus(${app.id}, this.value)" 
                                class="px-3 py-1 border rounded-lg text-sm ${getStatusColor(app.status)}">
                            <option value="pending" ${app.status === 'pending' ? 'selected' : ''}>Pending</option>
                            <option value="confirmed" ${app.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                            <option value="completed" ${app.status === 'completed' ? 'selected' : ''}>Completed</option>
                            <option value="cancelled" ${app.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

async function loadAllDoctors() {
    try {
        const doctors = await API.adminGetDoctors();
        const container = document.getElementById('doctors-list');
        
        container.innerHTML = doctors.map(doctor => `
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user-md text-2xl text-indigo-600"></i>
                        </div>
                        <div class="ml-3">
                            <h3 class="font-bold">${doctor.name}</h3>
                            <p class="text-sm text-indigo-600">${doctor.specialization}</p>
                        </div>
                    </div>
                    <span class="px-2 py-1 ${doctor.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} rounded-full text-xs">
                        ${doctor.is_active ? 'Active' : 'Inactive'}
                    </span>
                </div>
                <div class="space-y-2 text-sm">
                    <p><i class="fas fa-graduation-cap mr-2"></i>${doctor.qualification}</p>
                    <p><i class="fas fa-briefcase mr-2"></i>${doctor.experience_years}+ years</p>
                    <p><i class="fas fa-dollar-sign mr-2"></i>$${doctor.consultation_fee}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading doctors:', error);
    }
}

async function loadAllPatients() {
    try {
        const patients = await API.adminGetUsers('patient');
        const container = document.getElementById('patients-list');
        
        if (!patients.length) {
            container.innerHTML = '<div class="text-center py-8 text-gray-500">No patients found</div>';
            return;
        }
        
        container.innerHTML = patients.map(patient => `
            <div class="p-4 hover:bg-gray-50 flex justify-between items-center">
                <div>
                    <p class="font-semibold">${patient.name}</p>
                    <p class="text-sm text-gray-600">${patient.email}</p>
                    <p class="text-sm text-gray-500">${patient.phone || 'No phone'}</p>
                </div>
                <div class="text-right">
                    <p class="text-xs text-gray-500">Joined: ${new Date(patient.created_at).toLocaleDateString()}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading patients:', error);
    }
}

function loadProfile() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    document.getElementById('profile-name').value = user.name || '';
    document.getElementById('profile-email').value = user.email || '';
    document.getElementById('profile-phone').value = user.phone || '';
}

async function updateProfile(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('profile-name').value,
        phone: document.getElementById('profile-phone').value
    };
    
    try {
        await API.updateProfile(userData);
        alert('Profile updated successfully');
        
        // Update local storage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.name = userData.name;
        user.phone = userData.phone;
        localStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        alert('Failed to update profile: ' + error.message);
    }
}

async function addDoctor(event) {
    event.preventDefault();
    
    const doctorData = {
        name: document.getElementById('doc-name').value,
        email: document.getElementById('doc-email').value,
        password: document.getElementById('doc-password').value,
        phone: document.getElementById('doc-phone').value,
        specialization: document.getElementById('doc-specialization').value,
        qualification: document.getElementById('doc-qualification').value,
        experience_years: parseInt(document.getElementById('doc-experience').value),
        consultation_fee: parseFloat(document.getElementById('doc-fee').value),
        available_days: document.getElementById('doc-days').value,
        available_time_start: document.getElementById('doc-start-time').value,
        available_time_end: document.getElementById('doc-end-time').value,
        about: document.getElementById('doc-about').value
    };
    
    try {
        await API.adminCreateDoctor(doctorData);
        alert('Doctor added successfully');
        closeAddDoctorModal();
        loadAllDoctors();
    } catch (error) {
        alert('Failed to add doctor: ' + error.message);
    }
}

async function updateAppointmentStatus(appointmentId, status) {
    try {
        await API.adminUpdateAppointmentStatus(appointmentId, status);
        alert('Appointment status updated');
        loadAllAppointments();
        loadStats();
        loadAppointmentsChart();
    } catch (error) {
        alert('Failed to update status: ' + error.message);
    }
}

function getStatusColor(status) {
    const colors = {
        pending: 'bg-yellow-100 text-yellow-800',
        confirmed: 'bg-green-100 text-green-800',
        completed: 'bg-blue-100 text-blue-800',
        cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

function openAddDoctorModal() {
    document.getElementById('add-doctor-modal').style.display = 'flex';
    document.getElementById('add-doctor-modal').classList.remove('hidden');
}

function closeAddDoctorModal() {
    document.getElementById('add-doctor-modal').style.display = 'none';
    document.getElementById('add-doctor-modal').classList.add('hidden');
}

// Event listeners
document.getElementById('status-filter')?.addEventListener('change', loadAllAppointments);

function logout() {
    API.setToken(null);
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}