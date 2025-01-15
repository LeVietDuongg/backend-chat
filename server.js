const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
let messages = [];

// Cung cấp file tĩnh cho client
app.use(express.static('public'));

// Xử lý kết nối socket
io.on('connection', (socket) => {
    console.log('Người dùng đã kết nối');

    socket.on('setUsername', (username) => {
        socket.username = username;
    });

    socket.on('chat message', (text) => {
        const msg = {
            user: socket.username || 'Anonymous',
            text,
            time: new Date().toLocaleString()
        };
        messages.push(msg);
        if (messages.length > 10) messages.shift();
        io.emit('chat message', msg);
    });

    socket.emit('initMessages', messages);

    socket.on('disconnect', () => {
        console.log('Người dùng đã ngắt kết nối');
    });
});

// Chạy server
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
