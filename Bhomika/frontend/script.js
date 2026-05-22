
// Auth handling for login/register page
const API_URL = 'http://localhost:3000/api';

// Tab switching
const tabBtns = document.querySelectorAll('.tab-btn');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const authMessage = document.getElementById('auth-message');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        if (tab === 'login') {
            loginForm.classList.add('active');
            registerForm.classList.remove('active');
        } else {
            loginForm.classList.remove('active');
            registerForm.classList.add('active');
        }
        clearMessage();
    });
});

function showMessage(message, isError = true) {
    authMessage.textContent = message;
    authMessage.className = isError ? 'auth-message error' : 'auth-message success';
    setTimeout(() => {
        if (authMessage.textContent === message) {
            clearMessage();
        }
    }, 3000);
}

function clearMessage() {
    authMessage.textContent = '';
    authMessage.className = 'auth-message';
}

// Login
document.getElementById('login-btn').addEventListener('click', async () => {
    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    
    if (!username || !password) {
        showMessage('Please enter both username and password');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showMessage('Login successful! Redirecting...', false);
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(data.error || 'Login failed');
        }
    } catch (error) {
        showMessage('Server error. Make sure the backend is running.');
    }
});

// Register
document.getElementById('register-btn').addEventListener('click', async () => {
    const username = document.getElementById('reg-username').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    
    if (!username || !email || !password) {
        showMessage('Please fill in all fields');
        return;
    }
    
    if (password.length < 4) {
        showMessage('Password must be at least 4 characters');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            showMessage('Registration successful! Redirecting...', false);
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            showMessage(data.error || 'Registration failed');
        }
    } catch (error) {
        showMessage('Server error. Make sure the backend is running.');
    }
});

// Allow Enter key submission
document.querySelectorAll('#login-password, #reg-password').forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const isLogin = input.id === 'login-password';
            if (isLogin) {
                document.getElementById('login-btn').click();
            } else {
                document.getElementById('register-btn').click();
            }
        }
    });
});