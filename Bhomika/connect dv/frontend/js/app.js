const API_BASE = 'http://localhost:5000/api';
let currentUser = null;
let products = [];

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProducts();
    showPage('home');
    setupDarkMode();
    setupMobileMenu();
});

// Load products from API
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE}/products`);
        products = await response.json();
        return products;
    } catch (error) {
        console.error('Error loading products:', error);
        return [];
    }
}

// Show different pages
async function showPage(page) {
    const mainContent = document.getElementById('mainContent');
    
    switch(page) {
        case 'home':
            mainContent.innerHTML = await renderHome();
            break;
        case 'products':
            mainContent.innerHTML = renderProducts();
            break;
        case 'categories':
            mainContent.innerHTML = renderCategories();
            break;
        case 'about':
            mainContent.innerHTML = renderAbout();
            break;
        case 'contact':
            mainContent.innerHTML = renderContact();
            break;
        case 'cart':
            mainContent.innerHTML = await renderCart();
            break;
        case 'login':
            mainContent.innerHTML = renderLogin();
            break;
        case 'register':
            mainContent.innerHTML = renderRegister();
            break;
    }
}

// Render Home Page
async function renderHome() {
    const featuredProducts = products.slice(0, 4);
    
    return `
        <!-- Hero Section -->
        <div class="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl p-12 mb-12">
            <div class="text-center">
                <h1 class="text-5xl font-bold mb-4">Summer Sale!</h1>
                <p class="text-xl mb-6">Up to 50% off on selected items</p>
                <button onclick="showPage('products')" class="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition">
                    Shop Now
                </button>
            </div>
        </div>
        
        <!-- Categories -->
        <div class="mb-12">
            <h2 class="text-3xl font-bold mb-6">Shop by Category</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                ${['Electronics', 'Fashion', 'Shoes', 'Accessories'].map(cat => `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition" onclick="filterByCategory('${cat}')">
                        <img src="https://source.unsplash.com/400x300/?${cat.toLowerCase()}" alt="${cat}" class="w-full h-40 object-cover">
                        <div class="p-4 text-center font-semibold">${cat}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <!-- Featured Products -->
        <div>
            <h2 class="text-3xl font-bold mb-6">Featured Products</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                ${featuredProducts.map(product => renderProductCard(product)).join('')}
            </div>
        </div>
        
        <!-- Features -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
            <div class="text-center p-4">
                <i class="fas fa-truck text-4xl text-purple-600 mb-2"></i>
                <p class="font-semibold">Free Delivery</p>
            </div>
            <div class="text-center p-4">
                <i class="fas fa-lock text-4xl text-purple-600 mb-2"></i>
                <p class="font-semibold">Secure Payment</p>
            </div>
            <div class="text-center p-4">
                <i class="fas fa-clock text-4xl text-purple-600 mb-2"></i>
                <p class="font-semibold">24/7 Support</p>
            </div>
            <div class="text-center p-4">
                <i class="fas fa-undo text-4xl text-purple-600 mb-2"></i>
                <p class="font-semibold">30 Day Returns</p>
            </div>
        </div>
    `;
}

// Render Products Page
function renderProducts() {
    return `
        <div class="mb-6">
            <input type="text" id="searchInput" placeholder="Search products..." class="w-full md:w-96 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600">
        </div>
        <div id="productsGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${products.map(product => renderProductCard(product)).join('')}
        </div>
    `;
}

// Render Product Card
function renderProductCard(product) {
    return `
        <div class="bg-white rounded-lg shadow-md overflow-hidden product-card">
            <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
            <div class="p-4">
                <h3 class="font-semibold text-lg mb-2">${product.name}</h3>
                <div class="flex items-center mb-2">
                    ${'★'.repeat(Math.floor(product.rating))}${product.rating % 1 ? '½' : ''}
                    <span class="text-gray-500 ml-2">(${product.rating})</span>
                </div>
                <p class="text-2xl font-bold text-purple-600 mb-3">$${product.price}</p>
                <button onclick="addToCart(${product.id})" class="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

// Other rendering functions...
function renderCategories() {
    return `<h1 class="text-3xl font-bold mb-6">Categories Page</h1><p>Browse products by category</p>`;
}

function renderAbout() {
    return `<div class="text-center"><h1 class="text-3xl font-bold mb-4">About Us</h1><p class="text-lg">We are dedicated to providing the best online shopping experience.</p></div>`;
}

function renderContact() {
    return `<div class="max-w-2xl mx-auto"><h1 class="text-3xl font-bold mb-6 text-center">Contact Us</h1><form class="space-y-4"><input type="text" placeholder="Name" class="w-full px-4 py-2 border rounded-lg"><input type="email" placeholder="Email" class="w-full px-4 py-2 border rounded-lg"><textarea rows="4" placeholder="Message" class="w-full px-4 py-2 border rounded-lg"></textarea><button class="bg-purple-600 text-white px-6 py-2 rounded-lg w-full">Send Message</button></form></div>`;
}

// Setup functions
function setupDarkMode() {
    const toggle = document.getElementById('darkModeToggle');
    toggle?.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        localStorage.setItem('darkMode', document.body.classList.contains('dark'));
    });
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
    }
}

function setupMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');
    btn?.addEventListener('click', () => {
        menu.classList.toggle('hidden');
    });
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}