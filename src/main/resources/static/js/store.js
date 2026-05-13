const API_BASE = 'http://localhost:8080/api';
let allMedicines = [];
let cart = [];

document.addEventListener('DOMContentLoaded', () => {
    loadMedicines();
    setupSearch();
    setupCategories();
});

async function loadMedicines() {
    try {
        const res = await fetch(`${API_BASE}/medicines`);
        allMedicines = await res.json();
        renderProducts(allMedicines);
    } catch (error) {
        console.error('Failed to load medicines:', error);
        document.getElementById('product-grid').innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: red;">Failed to connect to backend.</p>';
    }
}

function renderProducts(medicines) {
    const grid = document.getElementById('product-grid');
    grid.innerHTML = '';
    
    if (medicines.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 40px;">No medicines found.</p>';
        return;
    }

    medicines.forEach(med => {
        const imgUrl = med.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80';
        const rxBadge = med.isPrescriptionRequired ? `<div class="rx-badge"><i class="fa-solid fa-file-prescription"></i> Rx Required</div>` : '';
        const ratingStars = getRatingStars(med.rating || 4.5);
        
        let stockBadge = '';
        if (med.quantity > 50) stockBadge = `<span style="font-size: 0.75rem; color: #10b981; font-weight: 600; background: #d1fae5; padding: 2px 8px; border-radius: 12px;">In Stock</span>`;
        else if (med.quantity > 0) stockBadge = `<span style="font-size: 0.75rem; color: #f59e0b; font-weight: 600; background: #fef3c7; padding: 2px 8px; border-radius: 12px;">Low Stock</span>`;
        else stockBadge = `<span style="font-size: 0.75rem; color: #ef4444; font-weight: 600; background: #fee2e2; padding: 2px 8px; border-radius: 12px;">Out of Stock</span>`;
        
        grid.innerHTML += `
            <div class="product-card">
                ${rxBadge}
                <img src="${imgUrl}" alt="${med.name}" class="product-img">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 5px;">
                    <div class="product-title">${med.name}</div>
                    ${stockBadge}
                </div>
                <div class="product-generic">${med.genericName || med.category}</div>
                <div class="product-rating">${ratingStars} <span style="color:var(--text-muted); font-size:0.8rem;">(${(med.rating || 4.5).toFixed(1)})</span></div>
                
                <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px; flex: 1;">
                    <i class="fa-solid fa-check text-success"></i> Uses: ${med.uses ? med.uses.substring(0, 50) + '...' : med.description}
                </div>

                <div class="product-footer">
                    <div class="product-price">₹${med.price.toFixed(2)}</div>
                    <button class="btn btn-add" onclick="addToCart(${med.id})">Add to Cart</button>
                </div>
            </div>
        `;
    });
}

function getRatingStars(rating) {
    let stars = '';
    for(let i=1; i<=5; i++) {
        if(rating >= i) stars += '<i class="fa-solid fa-star"></i>';
        else if(rating >= i - 0.5) stars += '<i class="fa-solid fa-star-half-stroke"></i>';
        else stars += '<i class="fa-regular fa-star"></i>';
    }
    return stars;
}

function setupSearch() {
    const searchInput = document.getElementById('search-input');
    const suggestions = document.getElementById('search-suggestions');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const query = e.target.value.trim();
        
        if (query.length < 2) {
            suggestions.style.display = 'none';
            renderProducts(allMedicines); // Reset
            return;
        }

        debounceTimer = setTimeout(async () => {
            try {
                const res = await fetch(`${API_BASE}/medicines/search?query=${encodeURIComponent(query)}`);
                const results = await res.json();
                
                renderProducts(results);
                
                // Show suggestions drop down
                suggestions.innerHTML = '';
                if(results.length > 0) {
                    results.slice(0, 5).forEach(med => {
                        suggestions.innerHTML += `
                            <div class="suggestion-item" onclick="selectSuggestion('${med.name}')">
                                <i class="fa-solid fa-pills" style="color: var(--primary);"></i>
                                <div>
                                    <div style="font-weight: 500;">${med.name}</div>
                                    <div style="font-size: 0.8rem; color: var(--text-muted);">${med.genericName || med.category}</div>
                                </div>
                            </div>
                        `;
                    });
                    suggestions.style.display = 'block';
                } else {
                    suggestions.style.display = 'none';
                }
            } catch (error) {
                console.error("Search failed:", error);
            }
        }, 300);
    });

    // Close suggestions when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.style.display = 'none';
        }
    });
}

function selectSuggestion(name) {
    document.getElementById('search-input').value = name;
    document.getElementById('search-suggestions').style.display = 'none';
    // Trigger input event to re-search exact match
    document.getElementById('search-input').dispatchEvent(new Event('input'));
}

function setupCategories() {
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            const category = pill.innerText;
            if (category === 'All Medicines') {
                renderProducts(allMedicines);
            } else {
                const filtered = allMedicines.filter(m => m.category && m.category.toLowerCase() === category.toLowerCase());
                renderProducts(filtered);
            }
        });
    });
}

function addToCart(id) {
    const med = allMedicines.find(m => m.id === id);
    if (!med) return;
    
    cart.push(med);
    document.getElementById('cart-count').innerText = cart.length;
    
    // Add small animation to cart icon
    const cartBtn = document.querySelector('.fa-cart-shopping').parentElement;
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);

    renderCart();
}

function toggleCart() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    
    if (panel.classList.contains('open')) {
        panel.classList.remove('open');
        overlay.style.display = 'none';
    } else {
        panel.classList.add('open');
        overlay.style.display = 'block';
    }
}

document.getElementById('cart-overlay').addEventListener('click', toggleCart);

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    let total = 0;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align:center; color:var(--text-muted); margin-top:50px;">Your cart is empty.</p>';
        document.getElementById('cart-total').innerText = '₹0.00';
        return;
    }

    cartItems.innerHTML = '';
    
    // Group identical items
    const itemCounts = {};
    cart.forEach(item => {
        itemCounts[item.id] = (itemCounts[item.id] || 0) + 1;
    });

    for (const [id, qty] of Object.entries(itemCounts)) {
        const med = cart.find(m => m.id == id);
        const itemTotal = med.price * qty;
        total += itemTotal;
        const imgUrl = med.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=500&q=80';
        
        cartItems.innerHTML += `
            <div class="cart-item">
                <img src="${imgUrl}" class="cart-item-img">
                <div style="flex:1;">
                    <div style="font-weight:600;">${med.name}</div>
                    <div style="font-size:0.85rem; color:var(--text-muted);">₹${med.price.toFixed(2)} x ${qty}</div>
                </div>
                <div style="font-weight:700;">₹${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }
    
    document.getElementById('cart-total').innerText = `₹${total.toFixed(2)}`;
}

// Checkout Logic
function openCheckout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }
    toggleCart(); // Close cart
    document.getElementById('checkout-modal').style.display = 'flex';
    calculateFinalTotal();
}

function closeCheckout() {
    document.getElementById('checkout-modal').style.display = 'none';
}

function calculateFinalTotal() {
    let subtotal = 0;
    cart.forEach(med => { subtotal += med.price; });
    
    const isEmergency = document.getElementById('checkout-emergency').checked;
    let deliveryFee = 50.00; // Standard flat fee
    if (isEmergency) deliveryFee += 150.00;
    
    const totalAmount = subtotal + deliveryFee;
    
    document.getElementById('summary-subtotal').innerText = `₹${subtotal.toFixed(2)}`;
    document.getElementById('summary-delivery').innerText = `₹${deliveryFee.toFixed(2)}`;
    document.getElementById('summary-total').innerText = `₹${totalAmount.toFixed(2)}`;
}

// Submit Order
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const address = document.getElementById('checkout-address').value;
    const date = document.getElementById('checkout-date').value;
    const time = document.getElementById('checkout-time').value;
    const isEmergency = document.getElementById('checkout-emergency').checked;
    
    // Group cart items for API payload
    const itemCounts = {};
    cart.forEach(item => { itemCounts[item.id] = (itemCounts[item.id] || 0) + 1; });
    
    const orderItems = [];
    for (const [id, qty] of Object.entries(itemCounts)) {
        orderItems.push({
            medicine: { id: parseInt(id) },
            quantity: qty
        });
    }

    let subtotal = 0;
    cart.forEach(med => { subtotal += med.price; });
    let deliveryFee = isEmergency ? 200.00 : 50.00;
    
    const salePayload = {
        totalAmount: subtotal + deliveryFee,
        isDelivery: true,
        deliveryAddress: address,
        deliveryDate: date,
        deliveryTime: time,
        isEmergencyDelivery: isEmergency,
        deliveryFee: deliveryFee,
        items: orderItems,
        customer: { id: 1 } // Using generic 'Walk-in Customer' for now
    };

    try {
        const res = await fetch(`${API_BASE}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(salePayload)
        });
        
        if (!res.ok) throw new Error("Failed to place order.");
        
        alert("Order Placed Successfully!");
        
        // Reset Cart
        cart = [];
        document.getElementById('cart-count').innerText = '0';
        renderCart();
        closeCheckout();
        
        // Refresh product stock display
        loadMedicines();
        
        // Redirect to dashboard (to be built)
        window.location.href = "customer-dashboard.html";
    } catch (error) {
        console.error("Order error:", error);
        alert("There was an error placing your order. Please try again.");
    }
});
