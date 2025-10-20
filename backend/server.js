const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require("socket.io");
const Chat = require('./models/Chat');
const User = require('./models/User'); // Import User model for population

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/college-marketplace', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/chat', require('./routes/chat'));

app.get('/api/config/maps-key', (req, res) => {
    res.json({ apiKey: process.env.GOOGLE_MAPS_API_KEY });
});

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// --- THIS SOCKET.IO SECTION IS UPDATED ---
io.on('connection', (socket) => {
    console.log('🔌 A user connected:', socket.id);

    socket.on('joinRoom', (chatId) => {
        socket.join(chatId);
        console.log(`User ${socket.id} joined room ${chatId}`);
    });

    socket.on('sendMessage', async ({ chatId, senderId, text }) => {
        try {
            console.log(`Received message for chat ${chatId}: "${text}" from ${senderId}`);
            const chat = await Chat.findById(chatId);
            if (chat) {
                const newMessage = { sender: senderId, text: text };
                chat.messages.push(newMessage);
                chat.lastMessage = text;
                chat.lastMessageAt = Date.now();
                await chat.save();
                
                const sender = await User.findById(senderId).select('name');
                if (!sender) {
                    console.error(`Could not find sender with ID: ${senderId}`);
                    return; // Stop if sender not found
                }

                // Construct a message object that is fully populated for the client
                const populatedMessage = {
                    _id: chat.messages[chat.messages.length - 1]._id,
                    sender: sender,
                    text: text,
                    createdAt: chat.messages[chat.messages.length - 1].createdAt,
                    chatId: chatId // Pass chatId back to the client
                };
                
                // Broadcast the message to everyone in the room
                io.to(chatId).emit('receiveMessage', populatedMessage);
                console.log(`Broadcasted message to room ${chatId}`);
            } else {
                console.error(`Chat not found with ID: ${chatId}`);
            }
        } catch (error) {
            console.error('Socket sendMessage error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('🔥 A user disconnected:', socket.id);
    });
});
// --- END OF UPDATE ---


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

