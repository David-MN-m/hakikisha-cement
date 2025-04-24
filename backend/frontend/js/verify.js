// Initialize socket connection
const socket = socketService;

async function verifyProduct(code) {
    try {
        const result = await api.verifyProduct(code);
        
        if (result.status === 'valid') {
            displayVerificationResult(result.product);
        } else {
            showError('Invalid verification code');
        }
    } catch (error) {
        showError(error.message);
    }
}

// QR Code scanner integration
function initQRScanner() {
    const video = document.getElementById('qr-video');
    const qrScanner = new QrScanner(video, result => {
        qrScanner.stop();
        verifyProduct(result);
    });
    qrScanner.start();
}

// Manual code verification
document.getElementById('manual-verify-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = document.getElementById('verification-code').value;
    await verifyProduct(code);
});

function displayVerificationResult(product) {
    const resultDiv = document.getElementById('verification-result');
    resultDiv.innerHTML = `
        <div class="result-card ${product.status === 'valid' ? 'valid' : 'invalid'}">
            <h2>Product Verified</h2>
            <p><strong>Brand:</strong> ${product.brand}</p>
            <p><strong>Type:</strong> ${product.type}</p>
            <p><strong>Manufacturer:</strong> ${product.manufacturer}</p>
            <p><strong>Status:</strong> ${product.status}</p>
        </div>
    `;
} 