
// Dashboard logic
const API_URL = 'http://localhost:3000/api';
let currentUser = null;
let expenses = [];

// Check authentication
function checkAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (!token || !user) {
        window.location.href = 'login.html';
        return false;
    }
    
    currentUser = JSON.parse(user);
    document.getElementById('user-name').textContent = currentUser.username;
    return true;
}

// Helper for API calls
async function apiRequest(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    };
    
    const response = await fetch(`${API_URL}${endpoint}`, { ...defaultOptions, ...options });
    
    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
        return null;
    }
    
    return response;
}

// Load dashboard data
async function loadDashboard() {
    await Promise.all([loadExpenses(), loadSummary()]);
}

// Load expenses
async function loadExpenses() {
    const response = await apiRequest('/expenses');
    if (!response) return;
    
    if (response.ok) {
        expenses = await response.json();
        renderExpenses();
    }
}

// Load summary stats
async function loadSummary() {
    const response = await apiRequest('/summary');
    if (!response || !response.ok) return;
    
    const summary = await response.json();
    document.getElementById('total-expenses').textContent = `$${summary.totalExpenses.toFixed(2)}`;
    document.getElementById('monthly-expenses').textContent = `$${summary.monthlyTotal.toFixed(2)}`;
    document.getElementById('transaction-count').textContent = summary.expenseCount;
}

// Render expenses list
function renderExpenses() {
    const container = document.getElementById('expenses-list');
    const filter = document.getElementById('category-filter').value;
    
    let filteredExpenses = [...expenses];
    if (filter !== 'all') {
        filteredExpenses = filteredExpenses.filter(e => e.category === filter);
    }
    
    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    if (filteredExpenses.length === 0) {
        container.innerHTML = '<div class="loading">No expenses found. Add your first expense!</div>';
        return;
    }
    
    container.innerHTML = filteredExpenses.map(expense => `
        <div class="expense-item" data-id="${expense.id}">
            <div class="expense-info">
                <div class="expense-category">${getCategoryIcon(expense.category)} ${expense.category}</div>
                <div class="expense-description">${escapeHtml(expense.description) || 'No description'}</div>
                <div class="expense-date">📅 ${formatDate(expense.date)}</div>
            </div>
            <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
            <button class="edit-expense-btn" onclick="openEditModal(${expense.id})">✏️ Edit</button>
        </div>
    `).join('');
}

function getCategoryIcon(category) {
    const icons = {
        'Food': '🍔',
        'Transport': '🚗',
        'Shopping': '🛍️',
        'Entertainment': '🎬',
        'Bills': '💡',
        'Healthcare': '🏥',
        'Other': '📌'
    };
    return icons[category] || '📌';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add expense
async function addExpense() {
    const amount = document.getElementById('expense-amount').value;
    const category = document.getElementById('expense-category').value;
    const date = document.getElementById('expense-date').value;
    const description = document.getElementById('expense-description').value;
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    const response = await apiRequest('/expenses', {
        method: 'POST',
        body: JSON.stringify({ amount: parseFloat(amount), category, date, description })
    });
    
    if (response && response.ok) {
        document.getElementById('expense-amount').value = '';
        document.getElementById('expense-description').value = '';
        document.getElementById('expense-date').value = '';
        await loadDashboard();
    } else if (response) {
        const error = await response.json();
        alert(error.error || 'Failed to add expense');
    }
}

// Edit modal functions
let currentEditId = null;

function openEditModal(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
    
    currentEditId = id;
    document.getElementById('edit-id').value = expense.id;
    document.getElementById('edit-amount').value = expense.amount;
    document.getElementById('edit-category').value = expense.category;
    document.getElementById('edit-date').value = expense.date;
    document.getElementById('edit-description').value = expense.description || '';
    
    document.getElementById('edit-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('edit-modal').style.display = 'none';
    currentEditId = null;
}

// Update expense
async function updateExpense() {
    const amount = document.getElementById('edit-amount').value;
    const category = document.getElementById('edit-category').value;
    const date = document.getElementById('edit-date').value;
    const description = document.getElementById('edit-description').value;
    
    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (!date) {
        alert('Please select a date');
        return;
    }
    
    const response = await apiRequest(`/expenses/${currentEditId}`, {
        method: 'PUT',
        body: JSON.stringify({ amount: parseFloat(amount), category, date, description })
    });
    
    if (response && response.ok) {
        closeModal();
        await loadDashboard();
    } else if (response) {
        const error = await response.json();
        alert(error.error || 'Failed to update expense');
    }
}

// Delete expense
async function deleteExpense() {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    const response = await apiRequest(`/expenses/${currentEditId}`, {
        method: 'DELETE'
    });
    
    if (response && response.ok) {
        closeModal();
        await loadDashboard();
    } else if (response) {
        const error = await response.json();
        alert(error.error || 'Failed to delete expense');
    }
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// Set default date to today
function setDefaultDate() {
    const dateInput = document.getElementById('expense-date');
    if (dateInput && !dateInput.value) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    if (!checkAuth()) return;
    
    setDefaultDate();
    loadDashboard();
    
    document.getElementById('add-expense-btn').addEventListener('click', addExpense);
    document.getElementById('logout-btn').addEventListener('click', logout);
    document.getElementById('category-filter').addEventListener('change', renderExpenses);
    
    // Modal events
    document.getElementById('update-expense-btn').addEventListener('click', updateExpense);
    document.getElementById('delete-expense-btn').addEventListener('click', deleteExpense);
    document.querySelector('.close-modal').addEventListener('click', closeModal);
    window.addEventListener('click', (e) => {
        if (e.target === document.getElementById('edit-modal')) {
            closeModal();
        }
    });
    
    // Enter key for adding expense
    document.getElementById('expense-amount').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addExpense();
    });
});