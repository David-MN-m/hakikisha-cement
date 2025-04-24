// Initialize socket connection
const socket = socketService;

// Listen for order status updates
socket.onOrderStatusChanged(order => {
    updateOrderStatus(order);
});

async function loadVendors() {
    try {
        const vendors = await api.getVendors();
        const vendorSelect = document.getElementById('vendorSelect');
        vendorSelect.innerHTML = vendors.map(vendor => `
            <option value="${vendor.id}">${vendor.businessName}</option>
        `).join('');
    } catch (error) {
        showError(error.message);
    }
}

async function createOrder(orderData) {
    try {
        const order = await api.createOrder(orderData);
        showSuccess('Order placed successfully!');
        window.location.href = 'customer-dashboard.html';
    } catch (error) {
        showError(error.message);
    }
}

document.getElementById('orderForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const orderData = {
        vendorId: document.getElementById('vendorSelect').value,
        products: [{
            productId: document.getElementById('cementType').value,
            quantity: document.getElementById('quantity').value,
            price: getCurrentPrice()
        }],
        totalAmount: calculateTotal(),
        deliveryAddress: document.getElementById('address').value
    };

    await createOrder(orderData);
});

function updateOrderStatus(order) {
    const statusElement = document.querySelector(`[data-order-id="${order.id}"] .status`);
    if (statusElement) {
        statusElement.textContent = order.status;
        statusElement.className = `status ${order.status.toLowerCase()}`;
    }
} 