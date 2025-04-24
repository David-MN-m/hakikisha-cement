const socketIO = require('socket.io');

function setupSocket(server) {
    const io = socketIO(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected');

        // Join user-specific room
        socket.on('join', (userData) => {
            socket.join(`${userData.role}-${userData.id}`);
        });

        // Handle order updates
        socket.on('orderUpdate', (data) => {
            io.to(`customer-${data.customerId}`).emit('orderStatusChanged', data);
            io.to(`vendor-${data.vendorId}`).emit('orderStatusChanged', data);
        });

        // Handle product updates
        socket.on('productUpdate', (data) => {
            io.emit('productChanged', data);
        });

        // Handle verification updates
        socket.on('verificationUpdate', (data) => {
            io.to(`customer-${data.customerId}`).emit('verificationResult', data);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });
    });

    return io;
}

module.exports = { setupSocket }; 