async function addToCart(productId) {
    if (!currentUser) {
        showToast('Please login first');
        showPage('login');
        return;
    }
    
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity: 1 })
        });
        
        if (response.ok) {
            showToast('Added to cart!');
            updateCartCount();
        } else {
            showToast('Failed to add to cart');
        }
    } catch (error) {
        showToast('Error adding to cart');
    }
}

async function updateCartCount() {
    if (!currentUser) return;
    
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            const cart = await response.json();
            const total = cart.reduce((sum, item) => sum + item.quantity, 0);
            document.getElementById('cartCount').textContent = total;
        }
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

async function renderCart() {
    if (!currentUser) {
        showToast('Please login to view cart');
        showPage('login');
        return '';
    }
    
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (!response.ok) return '<p class="text-center">Error loading cart</p>';
        
        const cart = await response.json();
        
        if (cart.length === 0) {
            return '<div class="text-center py-12"><i class="fas fa-shopping-cart text-6xl text-gray-400 mb-4"></i><p class="text-xl">Your cart is empty</p><button onclick="showPage(\'products\')" class="mt-4 bg-purple-600 text-white px-6 py-2 rounded-lg">Shop Now</button></div>';
        }
        
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        return `
            <h1 class="text-3xl font-bold mb-8">Shopping Cart</h1>
            <div class="grid lg:grid-cols-3 gap-8">
                <div class="lg:col-span-2 space-y-4">
                    ${cart.map(item => `
                        <div class="bg-white rounded-lg shadow-md p-4 flex items-center">
                            <img src="${item.image}" alt="${item.name}" class="w-24 h-24 object-cover rounded">
                            <div class="flex-1 ml-4">
                                <h3 class="font-semibold text-lg">${item.name}</h3>
                                <p class="text-purple-600 font-bold">$${item.price}</p>
                                <div class="flex items-center mt-2">
                                    <button onclick="updateCartItem(${item.product_id}, ${item.quantity - 1})" class="px-3 py-1 bg-gray-200 rounded">-</button>
                                    <span class="mx-3">${item.quantity}</span>
                                    <button onclick="updateCartItem(${item.product_id}, ${item.quantity + 1})" class="px-3 py-1 bg-gray-200 rounded">+</button>
                                    <button onclick="removeFromCart(${item.product_id})" class="ml-4 text-red-600 hover:text-red-800">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="text-right">
                                <p class="font-bold text-lg">$${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="bg-white rounded-lg shadow-md p-6 h-fit">
                    <h2 class="text-xl font-bold mb-4">Order Summary</h2>
                    <div class="flex justify-between mb-2">
                        <span>Subtotal:</span>
                        <span>$${total.toFixed(2)}</span>
                    </div>
                    <div class="flex justify-between mb-4">
                        <span>Shipping:</span>
                        <span>Free</span>
                    </div>
                    <div class="border-t pt-4 mb-4">
                        <div class="flex justify-between font-bold text-lg">
                            <span>Total:</span>
                            <span>$${total.toFixed(2)}</span>
                        </div>
                    </div>
                    <button class="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition">
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        return '<p class="text-center text-red-600">Error loading cart</p>';
    }
}

async function updateCartItem(productId, newQuantity) {
    if (newQuantity < 1) {
        await removeFromCart(productId);
        return;
    }
    
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE}/cart/update/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quantity: newQuantity })
        });
        
        if (response.ok) {
            showPage('cart');
            updateCartCount();
        }
    } catch (error) {
        showToast('Error updating cart');
    }
}

async function removeFromCart(productId) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_BASE}/cart/remove/${productId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            showToast('Item removed from cart');
            showPage('cart');
            updateCartCount();
        }
    } catch (error) {
        showToast('Error removing from cart');
    }
}