async function register() {
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        const response = await fetch(`${API_BASE}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            showToast('Registration successful!');
            showPage('home');
            updateAuthUI();
        } else {
            showToast(data.error || 'Registration failed');
        }
    } catch (error) {
        showToast('Error connecting to server');
    }
}

async function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            currentUser = data.user;
            showToast('Login successful!');
            showPage('home');
            updateAuthUI();
        } else {
            showToast(data.error || 'Login failed');
        }
    } catch (error) {
        showToast('Error connecting to server');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    currentUser = null;
    showToast('Logged out successfully');
    showPage('home');
    updateAuthUI();
}

function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
        currentUser = JSON.parse(user);
        updateAuthUI();
    }
}

function updateAuthUI() {
    const authBtn = document.getElementById('authButton');
    if (currentUser) {
        authBtn.textContent = 'Logout';
        authBtn.onclick = logout;
    } else {
        authBtn.textContent = 'Login';
        authBtn.onclick = () => showPage('login');
    }
}

function toggleAuth() {
    if (currentUser) {
        logout();
    } else {
        showPage('login');
    }
}

function renderLogin() {
    return `
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>
            <div class="space-y-4">
                <input type="email" id="loginEmail" placeholder="Email" class="w-full px-4 py-2 border rounded-lg">
                <input type="password" id="loginPassword" placeholder="Password" class="w-full px-4 py-2 border rounded-lg">
                <button onclick="login()" class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                    Login
                </button>
                <p class="text-center">Don't have an account? <a href="#" onclick="showPage('register')" class="text-purple-600">Register</a></p>
            </div>
        </div>
    `;
}

function renderRegister() {
    return `
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>
            <div class="space-y-4">
                <input type="text" id="regName" placeholder="Full Name" class="w-full px-4 py-2 border rounded-lg">
                <input type="email" id="regEmail" placeholder="Email" class="w-full px-4 py-2 border rounded-lg">
                <input type="password" id="regPassword" placeholder="Password" class="w-full px-4 py-2 border rounded-lg">
                <button onclick="register()" class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
                    Register
                </button>
                <p class="text-center">Already have an account? <a href="#" onclick="showPage('login')" class="text-purple-600">Login</a></p>
            </div>
        </div>
    `;
}