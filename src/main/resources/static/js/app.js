const API_BASE = 'http://localhost:8080/api';

// State
let allMedicines = [];
let cart = [];
const TAX_RATE = 0.05; // 5%

// Admin Dropdown Toggle
document.getElementById('admin-menu-toggle').addEventListener('click', (e) => {
    e.stopPropagation();
    document.getElementById('admin-dropdown').classList.toggle('active');
});
document.addEventListener('click', () => {
    document.getElementById('admin-dropdown').classList.remove('active');
});

// Navigation Logic
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Update active class
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        e.currentTarget.classList.add('active');
        
        // Update title
        document.getElementById('topbar-title').innerText = e.currentTarget.innerText;
        
        // Show correct view
        const targetView = e.currentTarget.getAttribute('data-target');
        document.querySelectorAll('.view-section').forEach(view => {
            view.style.display = 'none';
        });
        document.getElementById(targetView).style.display = 'block';

        // Load data based on view
        if (targetView === 'dashboard-view') loadDashboard();
        if (targetView === 'medicines-view') loadMedicines();
        if (targetView === 'customers-view') loadCustomers();
        if (targetView === 'suppliers-view') loadSuppliers();
        if (targetView === 'pos-view') loadPOS();
    });
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    loadDashboard();
});

// Common Modal Logic
function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// --- Dashboard Logic ---
async function loadDashboard() {
    try {
        const response = await fetch(`${API_BASE}/dashboard/stats`);
        if (!response.ok) throw new Error("Server responded with error");
        const stats = await response.json();
        
        document.getElementById('stat-total-medicines').innerText = stats.totalMedicines || 0;
        document.getElementById('stat-low-stock').innerText = stats.lowStockMedicines || 0;
        document.getElementById('stat-todays-sales').innerText = `₹${(stats.todaysRevenue || 0).toFixed(2)}`;

        // Load low stock table
        const lowStockRes = await fetch(`${API_BASE}/medicines/low-stock`);
        const lowStock = await lowStockRes.json();
        const tbody = document.querySelector('#low-stock-table tbody');
        tbody.innerHTML = '';
        
        lowStock.forEach(med => {
            tbody.innerHTML += `
                <tr>
                    <td style="font-weight: 500;">${med.name}</td>
                    <td><span class="badge badge-danger">${med.quantity} remaining</span></td>
                    <td><button class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;" onclick="restockMedicine(${med.id})">Restock</button></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error('Error loading dashboard:', error);
        document.getElementById('stat-total-medicines').innerHTML = `<span style="color:var(--danger);font-size:1rem;">Backend Offline</span>`;
        alert("Could not connect to the Java Backend! Make sure your Spring Boot application is running.");
    }
}

async function restockMedicine(id) {
    const qtyStr = prompt("Enter quantity to add to stock:");
    if (!qtyStr) return;
    
    const qty = parseInt(qtyStr);
    if (isNaN(qty) || qty <= 0) {
        alert("Please enter a valid positive number.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/medicines/${id}`);
        if (!res.ok) throw new Error("Medicine not found");
        const medicine = await res.json();
        
        medicine.quantity += qty;
        
        const putRes = await fetch(`${API_BASE}/medicines/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(medicine)
        });
        
        if (!putRes.ok) throw new Error("Failed to update medicine");
        
        loadDashboard();
        if (document.getElementById('medicines-view').style.display === 'block') {
            loadMedicines();
        }
        alert(`Successfully restocked! New quantity is ${medicine.quantity}.`);
    } catch (error) {
        console.error("Error restocking:", error);
        alert("Failed to restock medicine. Please try again.");
    }
}

// --- Medicines Logic ---
async function loadMedicines() {
    try {
        const response = await fetch(`${API_BASE}/medicines`);
        allMedicines = await response.json();
        renderMedicinesTable(allMedicines);
    } catch (error) {
        console.error('Error loading medicines:', error);
    }
}

function renderMedicinesTable(medicines) {
    const tbody = document.querySelector('#medicines-table tbody');
    tbody.innerHTML = '';
    
    medicines.forEach(med => {
        let stockBadge = med.quantity > 20 ? `<span class="badge badge-success">${med.quantity}</span>` 
                         : (med.quantity > 0 ? `<span class="badge badge-warning">${med.quantity}</span>` : `<span class="badge badge-danger">Out of Stock</span>`);
        
        tbody.innerHTML += `
            <tr>
                <td style="color:var(--text-muted);">#${med.id}</td>
                <td style="font-weight:600">${med.name}</td>
                <td>${med.category || 'N/A'}</td>
                <td>${stockBadge}</td>
                <td style="font-weight: 500; color: var(--primary);">₹${med.price.toFixed(2)}</td>
                <td style="color:var(--text-muted);">${med.expiryDate || 'N/A'}</td>
            </tr>
        `;
    });
}

document.getElementById('medicine-search').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allMedicines.filter(m => m.name.toLowerCase().includes(term) || (m.category && m.category.toLowerCase().includes(term)));
    renderMedicinesTable(filtered);
});

function openMedicineModal() {
    document.getElementById('medicine-form').reset();
    document.getElementById('medicine-modal').classList.add('active');
}

document.getElementById('medicine-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newMedicine = {
        name: document.getElementById('med-name').value,
        category: document.getElementById('med-category').value,
        quantity: parseInt(document.getElementById('med-qty').value),
        price: parseFloat(document.getElementById('med-price').value),
        costPrice: parseFloat(document.getElementById('med-cost').value || 0),
        expiryDate: document.getElementById('med-expiry').value || null
    };

    try {
        await fetch(`${API_BASE}/medicines`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMedicine)
        });
        closeModal('medicine-modal');
        loadMedicines(); // Refresh table
    } catch (error) {
        alert('Failed to save medicine');
    }
});

// --- Customers Logic ---
async function loadCustomers() {
    try {
        const response = await fetch(`${API_BASE}/customers`);
        const customers = await response.json();
        const tbody = document.querySelector('#customers-table tbody');
        tbody.innerHTML = '';
        customers.forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td style="color:var(--text-muted);">#${c.id}</td>
                    <td style="font-weight:600">${c.name}</td>
                    <td>${c.phone || 'N/A'}</td>
                    <td>${c.email || 'N/A'}</td>
                    <td>${c.address || 'N/A'}</td>
                </tr>
            `;
        });
    } catch (error) { console.error('Error loading customers:', error); }
}

function openCustomerModal() {
    document.getElementById('customer-form').reset();
    document.getElementById('customer-modal').classList.add('active');
}

document.getElementById('customer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const customer = {
        name: document.getElementById('cust-name').value,
        phone: document.getElementById('cust-phone').value,
        email: document.getElementById('cust-email').value,
        address: document.getElementById('cust-address').value
    };
    try {
        await fetch(`${API_BASE}/customers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(customer) });
        closeModal('customer-modal');
        loadCustomers();
    } catch (error) { alert('Failed to save customer'); }
});

// --- Suppliers Logic ---
async function loadSuppliers() {
    try {
        const response = await fetch(`${API_BASE}/suppliers`);
        const suppliers = await response.json();
        const tbody = document.querySelector('#suppliers-table tbody');
        tbody.innerHTML = '';
        suppliers.forEach(s => {
            tbody.innerHTML += `
                <tr>
                    <td style="color:var(--text-muted);">#${s.id}</td>
                    <td style="font-weight:600">${s.name}</td>
                    <td>${s.contactPerson || 'N/A'}</td>
                    <td>${s.phone || 'N/A'}</td>
                    <td>${s.email || 'N/A'}</td>
                </tr>
            `;
        });
    } catch (error) { console.error('Error loading suppliers:', error); }
}

function openSupplierModal() {
    document.getElementById('supplier-form').reset();
    document.getElementById('supplier-modal').classList.add('active');
}

document.getElementById('supplier-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const supplier = {
        name: document.getElementById('sup-name').value,
        contactPerson: document.getElementById('sup-person').value,
        phone: document.getElementById('sup-phone').value,
        email: document.getElementById('sup-email').value
    };
    try {
        await fetch(`${API_BASE}/suppliers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(supplier) });
        closeModal('supplier-modal');
        loadSuppliers();
    } catch (error) { alert('Failed to save supplier'); }
});

// --- POS Logic ---
async function loadPOS() {
    try {
        const response = await fetch(`${API_BASE}/medicines`);
        allMedicines = await response.json();
        renderPOSProducts(allMedicines);
        renderCart();
    } catch (error) {
        console.error('Error loading POS:', error);
    }
}

function filterPOS() {
    const term = document.getElementById('pos-search-input').value.toLowerCase();
    const filtered = allMedicines.filter(m => m.name.toLowerCase().includes(term));
    renderPOSProducts(filtered);
}

function renderPOSProducts(medicines) {
    const container = document.getElementById('pos-product-list');
    container.innerHTML = '';
    
    medicines.filter(m => m.quantity > 0).forEach(med => {
        container.innerHTML += `
            <div class="card" style="cursor:pointer; transition:all 0.2s; border:1px solid var(--border);" onclick="addToCart(${med.id})" onmouseover="this.style.borderColor='var(--primary)'; this.style.transform='translateY(-3px)'" onmouseout="this.style.borderColor='var(--border)'; this.style.transform='translateY(0)'">
                <h4 style="margin-bottom:5px;">${med.name}</h4>
                <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom: 10px;">${med.category || 'Medicine'}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h3 style="color:var(--primary);">₹${med.price.toFixed(2)}</h3>
                    <span class="badge badge-success">Stock: ${med.quantity}</span>
                </div>
            </div>
        `;
    });
}

function addToCart(id) {
    const med = allMedicines.find(m => m.id === id);
    if (!med) return;

    const existing = cart.find(item => item.medicine.id === id);
    if (existing) {
        if (existing.quantity < med.quantity) existing.quantity++;
        else alert('Cannot add more than available stock!');
    } else {
        cart.push({ medicine: med, quantity: 1, unitPrice: med.price });
    }
    renderCart();
}

function updateCartQty(id, delta) {
    const item = cart.find(i => i.medicine.id === id);
    if (!item) return;
    
    item.quantity += delta;
    if (item.quantity <= 0) cart = cart.filter(i => i.medicine.id !== id);
    else if (item.quantity > item.medicine.quantity) {
        item.quantity = item.medicine.quantity;
        alert('Cannot exceed stock!');
    }
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';
    
    let subtotal = 0;

    if (cart.length === 0) {
        container.innerHTML = '<div style="color:var(--text-muted); text-align:center; margin-top:50px;"><i class="fa-solid fa-cart-shopping" style="font-size: 2rem; margin-bottom:10px; opacity: 0.5;"></i><br>Cart is empty</div>';
    } else {
        cart.forEach(item => {
            const itemTotal = item.quantity * item.unitPrice;
            subtotal += itemTotal;
            
            container.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; padding-bottom:15px; border-bottom:1px solid var(--border);">
                    <div style="flex:1;">
                        <h4 style="margin-bottom:5px; font-size: 0.95rem;">${item.medicine.name}</h4>
                        <div style="color:var(--text-muted); font-size:0.85rem;">₹${item.unitPrice.toFixed(2)} each</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px; background:var(--bg-main); padding:5px 10px; border-radius:8px;">
                        <button onclick="updateCartQty(${item.medicine.id}, -1)" style="background:none;border:none;color:var(--text-main);cursor:pointer;padding:5px;">-</button>
                        <span style="font-weight:600; width: 20px; text-align:center;">${item.quantity}</span>
                        <button onclick="updateCartQty(${item.medicine.id}, 1)" style="background:none;border:none;color:var(--text-main);cursor:pointer;padding:5px;">+</button>
                    </div>
                    <div style="font-weight:bold; color:var(--primary); width: 60px; text-align:right;">
                        ₹${itemTotal.toFixed(2)}
                    </div>
                </div>
            `;
        });
    }

    // Calculations
    const tax = subtotal * TAX_RATE;
    const discountInput = parseFloat(document.getElementById('cart-discount').value) || 0;
    const isDelivery = document.getElementById('cart-quick-delivery').checked;
    const deliveryFee = isDelivery ? 50.0 : 0.0;
    const total = subtotal + tax + deliveryFee - discountInput;

    document.getElementById('cart-subtotal').innerText = `₹${subtotal.toFixed(2)}`;
    document.getElementById('cart-tax').innerText = `₹${tax.toFixed(2)}`;
    document.getElementById('cart-total').innerText = `₹${Math.max(0, total).toFixed(2)}`;
}

function toggleDelivery() {
    const isDelivery = document.getElementById('cart-quick-delivery').checked;
    document.getElementById('delivery-address-container').style.display = isDelivery ? 'block' : 'none';
    document.getElementById('delivery-fee-row').style.display = isDelivery ? 'flex' : 'none';
    renderCart();
}

async function processSale() {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }

    // Calculate final totals
    const subtotal = cart.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
    const tax = subtotal * TAX_RATE;
    const discount = parseFloat(document.getElementById('cart-discount').value) || 0;
    const isDelivery = document.getElementById('cart-quick-delivery').checked;
    const deliveryFee = isDelivery ? 50.0 : 0.0;
    const deliveryAddress = isDelivery ? document.getElementById('cart-delivery-address').value : null;
    
    if (isDelivery && (!deliveryAddress || deliveryAddress.trim() === '')) {
        alert('Please enter a delivery address!');
        return;
    }

    const netTotal = Math.max(0, subtotal + tax + deliveryFee - discount);

    const saleData = {
        totalAmount: netTotal,
        discount: discount,
        isDelivery: isDelivery,
        deliveryAddress: deliveryAddress,
        items: cart.map(item => ({
            medicine: { id: item.medicine.id },
            quantity: item.quantity,
            unitPrice: item.unitPrice
        }))
    };

    try {
        await fetch(`${API_BASE}/sales`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(saleData)
        });
        
        showInvoice(subtotal, tax, discount, deliveryFee, netTotal, isDelivery, deliveryAddress);
        
        cart = [];
        document.getElementById('cart-discount').value = 0;
        document.getElementById('cart-quick-delivery').checked = false;
        document.getElementById('cart-delivery-address').value = '';
        toggleDelivery();
        renderCart();
        loadPOS(); // Refresh product list stock
    } catch (error) {
        alert('Failed to process sale');
    }
}

function showInvoice(subtotal, tax, discount, deliveryFee, netTotal, isDelivery, deliveryAddress) {
    const tbody = document.getElementById('invoice-items');
    tbody.innerHTML = '';
    
    cart.forEach(item => {
        tbody.innerHTML += `
            <tr>
                <td style="font-weight: 500;">${item.medicine.name}</td>
                <td>${item.quantity}</td>
                <td>₹${item.unitPrice.toFixed(2)}</td>
                <td style="text-align: right; font-weight: 600;">₹${(item.quantity * item.unitPrice).toFixed(2)}</td>
            </tr>
        `;
    });

    document.getElementById('inv-subtotal').innerText = `₹${subtotal.toFixed(2)}`;
    document.getElementById('inv-tax').innerText = `₹${tax.toFixed(2)}`;
    document.getElementById('inv-discount').innerText = `-₹${discount.toFixed(2)}`;
    
    if (isDelivery) {
        document.getElementById('inv-delivery-row').style.display = 'flex';
        document.getElementById('inv-delivery-fee').innerText = `₹${deliveryFee.toFixed(2)}`;
        document.getElementById('inv-delivery-address-section').style.display = 'block';
        document.getElementById('inv-delivery-address').innerText = deliveryAddress;
    } else {
        document.getElementById('inv-delivery-row').style.display = 'none';
        document.getElementById('inv-delivery-address-section').style.display = 'none';
    }

    document.getElementById('inv-total').innerText = `₹${netTotal.toFixed(2)}`;
    document.getElementById('invoice-date').innerText = new Date().toLocaleString();

    document.getElementById('invoice-modal').classList.add('active');
}
