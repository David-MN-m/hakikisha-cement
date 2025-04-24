class SocketService {
    constructor() {
        this.socket = io('http://localhost:5000');
        this.setupListeners();
    }

    setupListeners() {
        this.socket.on('connect', () => {
            console.log('Connected to WebSocket');
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from WebSocket');
        });
    }

    joinRoom(userData) {
        this.socket.emit('join', userData);
    }

    onOrderStatusChanged(callback) {
        this.socket.on('orderStatusChanged', callback);
    }

    onProductChanged(callback) {
        this.socket.on('productChanged', callback);
    }

    onVerificationResult(callback) {
        this.socket.on('verificationResult', callback);
    }

    emitOrderUpdate(data) {
        this.socket.emit('orderUpdate', data);
    }

    emitProductUpdate(data) {
        this.socket.emit('productUpdate', data);
    }

    disconnect() {
        this.socket.disconnect();
    }
}

const socketService = new SocketService();
export default socketService; 