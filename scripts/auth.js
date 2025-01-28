// Check authentication status
function checkAuth() {
    const isVendor = sessionStorage.getItem('isVendor');
    const currentPage = window.location.pathname.split('/').pop();
    
    // List of vendor-only pages
    const vendorPages = ['vendor-dashboard.html', 'vendors.html'];
    
    if (vendorPages.includes(currentPage) && !isVendor) {
        // Redirect to login if trying to access vendor pages without auth
        window.location.href = 'vendor-login.html';
        return false;
    }
    return true;
}

// Set vendor authentication
function setVendorAuth(status) {
    if (status) {
        sessionStorage.setItem('isVendor', 'true');
    } else {
        sessionStorage.removeItem('isVendor');
    }
}

// Logout function
function logout() {
    sessionStorage.removeItem('isVendor');
    window.location.href = 'index.html';
} 