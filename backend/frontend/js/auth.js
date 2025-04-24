const auth = {
    async login(email, password) {
        try {
            console.log('Login attempt for:', email); // Debug log

            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log('Login response:', data); // Debug log

            if (data.success && data.token) {
                // Store auth data
                localStorage.setItem('token', data.token);
                localStorage.setItem('userId', data.user._id);
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userName', data.user.name);
                
                // Verify storage
                console.log('Stored auth data:', {
                    token: localStorage.getItem('token'),
                    userId: localStorage.getItem('userId'),
                    userRole: localStorage.getItem('userRole')
                });
                
                return true;
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }
};

// Protect routes that require authentication
document.addEventListener('DOMContentLoaded', async () => {
    const protectedPages = {
        'customer-dashboard.html': 'customer',
        'vendor-dashboard.html': 'vendor',
        'Verify.html': 'customer',
        'orders.html': 'customer'
    };

    const currentPage = window.location.pathname.split('/').pop();
    if (protectedPages[currentPage]) {
        try {
            const response = await fetch('http://localhost:5000/is-authenticated', {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });
            const data = await response.json();
            if (!data.isAuthenticated) {
                window.location.href = '/landing.html';
                return;
            }

            const requiredRole = protectedPages[currentPage];
            const role = await auth.getRole();
            if (role !== requiredRole) {
                window.location.href = '/landing.html';
            }
        } catch (error) {
            throw error;
        }
    }
});