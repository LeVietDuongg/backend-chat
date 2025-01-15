const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Cung cấp file tĩnh cho client
app.use(express.static('public'));

// Xử lý kết nối socket
io.on('connection', (socket) => {
    console.log('Người dùng đã kết nối');

    // Nhận tin nhắn từ client và phát tới tất cả người dùng
    socket.on('chat message', (msg) => {
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('Người dùng đã ngắt kết nối');
    });
});

// Chạy server
const PORT = 3000;
server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
