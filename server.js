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

    socket.on('chat message', (msg) => {
        const item = document.createElement('li');
        if (msg.user === localStorage.getItem('chatUsername')) {
            item.classList.add('my-message');
        } else {
            item.classList.add('other-message');
        }
        item.textContent = `${msg.user} at ${msg.time}: ${msg.text}`;
        messages.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
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
