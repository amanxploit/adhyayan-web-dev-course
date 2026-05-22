let currentDoctor = null;

// Check authentication
if (!API.getToken()) {
    window.location.href = 'index.html';
}

// Load user info
const user = JSON.parse(localStorage.getItem('user') || '{}');
document.getElementById('user-name').textContent = `Welcome, ${user.name || 'User'}`;

// Initialize dashboard
loadDoctors();
loadAppointments();

// Tab switching
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.add('hidden');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('border-blue-500', 'text-blue-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    document.getElementById(`${tabName}-tab`).classList.remove('hidden');
    document.getElementById(`tab-${tabName}`).classList.add('border-blue-500', 'text-blue-600');
    
    if (tabName === 'doctors') {
        loadDoctors();
    } else {
        loadAppointments();
    }
}

// Load doctors
async function loadDoctors() {
    const filter = document.getElementById('specialization-filter')?.value || '';
    const filters = filter ? { specialization: filter } : {};
    
    try {
        const doctors = await API.getDoctors(filters);
        displayDoctors(doctors);
    } catch (error) {
        console.error('Error loading doctors:', error);
        document.getElementById('doctors-list').innerHTML = 
            '<div class="col-span-full text-center text-red-500">Failed to load doctors</div>';
    }
}

function displayDoctors(doctors) {
    const container = document.getElementById('doctors-list');
    
    if (!doctors.length) {
        container.innerHTML = '<div class="col-span-full text-center text-gray-500">No doctors found</div>';
        return;
    }
    
    container.innerHTML = doctors.map(doctor => `
        <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <i class="fas fa-user-md text-2xl text-blue-600"></i>
                        </div>
                        <div class="ml-3">
                            <h3 class="font-bold text-lg">${doctor.name}</h3>
                            <p class="text-blue-600 text-sm">${doctor.specialization}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-2xl font-bold text-green-600">$${doctor.consultation_fee}</p>
                        <p class="text-xs text-gray-500">per visit</p>
                    </div>
                </div>
                <div class="space-y-2 mb-4">
                    <p class="text-sm text-gray-600">
                        <i class="fas fa-graduation-cap mr-2"></i>${doctor.qualification || 'Not specified'}
                    </p>
                    <p class="text-sm text-gray-600">
                        <i class="fas fa-clock mr-2"></i>${doctor.experience_years}+ years experience
                    </p>
                    <p class="text-sm text-gray-600">
                        <i class="fas fa-calendar-alt mr-2"></i>${doctor.available_days}
                    </p>
                </div>
                <button onclick="openBookingModal(${doctor.id}, '${doctor.name}')" 
                        class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                    Book Appointment
                </button>
            </div>
        </div>
    `).join('');
}

// Booking modal
async function openBookingModal(doctorId, doctorName) {
    currentDoctor = { id: doctorId, name: doctorName };
    document.getElementById('booking-doctor-id').value = doctorId;
    document.getElementById('booking-doctor-name').value = doctorName;
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('booking-date').min = today;
    
    document.getElementById('booking-modal').classList.remove('hidden');
    document.getElementById('booking-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('booking-modal').style.display = 'none';
    document.getElementById('booking-modal').classList.add('hidden');
}

// Load available time slots
document.getElementById('booking-date')?.addEventListener('change', async (e) => {
    const date = e.target.value;
    const doctorId = document.getElementById('booking-doctor-id').value;
    
    if (date && doctorId) {
        try {
            const slots = await API.getDoctorSlots(doctorId, date);
            const timeSelect = document.getElementById('booking-time');
            timeSelect.innerHTML = '<option value="">Select time</option>';
            
            const availableSlots = slots.filter(slot => slot.isAvailable);
            if (availableSlots.length === 0) {
                timeSelect.innerHTML += '<option disabled>No available slots for this date</option>';
            } else {
                availableSlots.forEach(slot => {
                    timeSelect.innerHTML += `<option value="${slot.time}">${slot.time}</option>`;
                });
            }
        } catch (error) {
            console.error('Error loading slots:', error);
        }
    }
});

// Book appointment
async function bookAppointment(event) {
    event.preventDefault();
    
    const appointmentData = {
        doctor_id: parseInt(document.getElementById('booking-doctor-id').value),
        appointment_date: document.getElementById('booking-date').value,
        appointment_time: document.getElementById('booking-time').value,
        symptoms: document.getElementById('booking-symptoms').value
    };
    
    try {
        await API.bookAppointment(appointmentData);
        alert('Appointment booked successfully!');
        closeModal();
        loadAppointments();
        showTab('appointments');
    } catch (error) {
        alert('Failed to book appointment: ' + error.message);
    }
}

// Load appointments
async function loadAppointments() {
    try {
        const appointments = await API.getMyAppointments();
        displayAppointments(appointments);
    } catch (error) {
        console.error('Error loading appointments:', error);
        document.getElementById('appointments-list').innerHTML = 
            '<div class="text-center text-red-500">Failed to load appointments</div>';
    }
}

function displayAppointments(appointments) {
    const container = document.getElementById('appointments-list');
    
    if (!appointments.length) {
        container.innerHTML = `
            <div class="text-center py-12 bg-white rounded-lg">
                <i class="fas fa-calendar-alt text-4xl text-gray-400 mb-4"></i>
                <p class="text-gray-500">No appointments found</p>
                <button onclick="showTab('doctors')" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Book Your First Appointment
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = appointments.map(appointment => {
        const statusColors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-green-100 text-green-800',
            completed: 'bg-blue-100 text-blue-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        
        return `
            <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex flex-wrap justify-between items-start">
                    <div>
                        <h3 class="font-bold text-lg">Dr. ${appointment.doctor_name || 'Doctor'}</h3>
                        <p class="text-gray-600">${appointment.specialization}</p>
                        <div class="mt-2 space-y-1">
                            <p class="text-sm"><i class="far fa-calendar-alt mr-2"></i>${appointment.appointment_date}</p>
                            <p class="text-sm"><i class="far fa-clock mr-2"></i>${appointment.appointment_time}</p>
                            ${appointment.symptoms ? `<p class="text-sm"><i class="fas fa-notes-medical mr-2"></i>${appointment.symptoms}</p>` : ''}
                        </div>
                    </div>
                    <div class="text-right">
                        <span class="px-3 py-1 rounded-full text-xs font-semibold ${statusColors[appointment.status]}">
                            ${appointment.status.toUpperCase()}
                        </span>
                        ${appointment.status !== 'cancelled' ? `
                            <div class="mt-2">
                                <button onclick="cancelAppointment(${appointment.id})" 
                                        class="text-red-600 hover:text-red-700 text-sm">
                                    <i class="fas fa-times-circle mr-1"></i>Cancel
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function cancelAppointment(appointmentId) {
    if (confirm('Are you sure you want to cancel this appointment?')) {
        try {
            await API.cancelAppointment(appointmentId);
            alert('Appointment cancelled successfully');
            loadAppointments();
        } catch (error) {
            alert('Failed to cancel appointment: ' + error.message);
        }
    }
}

function logout() {
    API.setToken(null);
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}