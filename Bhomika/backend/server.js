
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, SECRET_KEY } = require('./middleware/auth');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Data file paths
const USERS_FILE = path.join(__dirname, 'data', 'users.json');
const EXPENSES_FILE = path.join(__dirname, 'data', 'expenses.json');

// Helper functions to read/write JSON files
const readData = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
};

// ========== AUTH ROUTES ==========
app.post('/api/register', async (req, res) => {
  const { username, password, email } = req.body;
  
  if (!username || !password || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  
  const users = readData(USERS_FILE);
  
  if (users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username already exists' });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: users.length + 1,
    username,
    password: hashedPassword,
    email
  };
  
  users.push(newUser);
  writeData(USERS_FILE, users);
  
  const token = jwt.sign({ id: newUser.id, username: newUser.username }, SECRET_KEY, { expiresIn: '24h' });
  res.json({ token, user: { id: newUser.id, username: newUser.username, email: newUser.email } });
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  
  const users = readData(USERS_FILE);
  const user = users.find(u => u.username === username);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '24h' });
  res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
});

// ========== EXPENSE ROUTES ==========
// Get all expenses for logged-in user
app.get('/api/expenses', authenticateToken, (req, res) => {
  const expenses = readData(EXPENSES_FILE);
  const userExpenses = expenses.filter(e => e.userId === req.user.id);
  res.json(userExpenses);
});

// Add new expense
app.post('/api/expenses', authenticateToken, (req, res) => {
  const { amount, category, description, date } = req.body;
  
  if (!amount || !category || !date) {
    return res.status(400).json({ error: 'Amount, category, and date are required' });
  }
  
  const expenses = readData(EXPENSES_FILE);
  const newExpense = {
    id: expenses.length + 1,
    userId: req.user.id,
    amount: parseFloat(amount),
    category,
    description: description || '',
    date
  };
  
  expenses.push(newExpense);
  writeData(EXPENSES_FILE, expenses);
  res.status(201).json(newExpense);
});

// Update expense
app.put('/api/expenses/:id', authenticateToken, (req, res) => {
  const expenseId = parseInt(req.params.id);
  const { amount, category, description, date } = req.body;
  
  const expenses = readData(EXPENSES_FILE);
  const expenseIndex = expenses.findIndex(e => e.id === expenseId && e.userId === req.user.id);
  
  if (expenseIndex === -1) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  
  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    amount: parseFloat(amount),
    category,
    description: description || '',
    date
  };
  
  writeData(EXPENSES_FILE, expenses);
  res.json(expenses[expenseIndex]);
});

// Delete expense
app.delete('/api/expenses/:id', authenticateToken, (req, res) => {
  const expenseId = parseInt(req.params.id);
  
  const expenses = readData(EXPENSES_FILE);
  const filteredExpenses = expenses.filter(e => !(e.id === expenseId && e.userId === req.user.id));
  
  if (filteredExpenses.length === expenses.length) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  
  writeData(EXPENSES_FILE, filteredExpenses);
  res.json({ message: 'Expense deleted successfully' });
});

// Get summary stats
app.get('/api/summary', authenticateToken, (req, res) => {
  const expenses = readData(EXPENSES_FILE);
  const userExpenses = expenses.filter(e => e.userId === req.user.id);
  
  const total = userExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  const categoryTotals = {};
  userExpenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });
  
  // Get last 30 days expenses
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentExpenses = userExpenses.filter(e => new Date(e.date) >= thirtyDaysAgo);
  const monthlyTotal = recentExpenses.reduce((sum, e) => sum + e.amount, 0);
  
  res.json({
    totalExpenses: total,
    monthlyTotal: monthlyTotal,
    categoryTotals,
    expenseCount: userExpenses.length
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Default user: demo / password: demo123');
});