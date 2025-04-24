const API_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('token', token);
    }

    async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...(this.token && { Authorization: `Bearer ${this.token}` }),
            ...options.headers
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async login(email, password, role) {
        const data = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password, role })
        });
        this.setToken(data.token);
        return data;
    }

    async register(userData) {
        const data = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        this.setToken(data.token);
        return data;
    }

    // Products endpoints
    async getProducts() {
        return this.request('/products');
    }

    async addProduct(productData) {
        return this.request('/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    // Orders endpoints
    async getOrders() {
        return this.request('/orders');
    }

    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    // Verifications endpoints
    async verifyProduct(code) {
        return this.request('/verifications/verify', {
            method: 'POST',
            body: JSON.stringify({ code })
        });
    }
}

const api = new ApiService();
export default api; 