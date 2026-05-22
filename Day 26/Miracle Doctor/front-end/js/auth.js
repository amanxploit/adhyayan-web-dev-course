// Check if already logged in
if (localStorage.getItem('token')) {
    window.location.href = 'dashboard.html';
}

function showLogin() {
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('register-form').classList.add('hidden');
}

function showRegister() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await API.login({ email, password });
        API.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Login failed: ' + error.message);
    }
}

async function handleRegister(event) {
    event.preventDefault();
    
    const userData = {
        name: document.getElementById('reg-name').value,
        email: document.getElementById('reg-email').value,
        phone: document.getElementById('reg-phone').value,
        password: document.getElementById('reg-password').value
    };
    
    try {
        const response = await API.register(userData);
        API.setToken(response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Registration failed: ' + error.message);
    }
}

// Show login form by default
showLogin();