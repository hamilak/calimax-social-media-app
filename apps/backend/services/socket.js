const socketIO = require('socket.io');
const MessageModel = require('../models/messages');

const initSocket = (server) => {
    const io = new socketIO.Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');
        
        socket.on('sendMessage', async (messageData) => {
            const { senderId, receiverId, text } = messageData;

            const message = new MessageModel({ senderId, receiverId, text });
            await message.save();

            socket.broadcast.emit('receiveMessage', message);
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });

    return io;
};

module.exports = initSocket;
