const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Find or create a chat for a product
router.post('/find-or-create', authMiddleware, async (req, res) => {
    try {
        const { productId } = req.body;
        const buyerId = req.user.userId;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, error: 'Product not found.' });
        }

        const sellerId = product.seller;

        // Prevent user from chatting with themselves
        if (buyerId.toString() === sellerId.toString()) {
            return res.status(400).json({ success: false, error: "You cannot start a chat for your own product." });
        }

        // Find a chat that involves this buyer for this specific product
        let chat = await Chat.findOne({
            product: productId,
            buyer: buyerId
        });

        if (!chat) {
            chat = new Chat({
                product: productId,
                buyer: buyerId,
                seller: sellerId
            });
            await chat.save();
        }

        res.json({ success: true, chat: chat });

    } catch (error) {
        console.error('Error in find-or-create chat:', error);
        res.status(500).json({ success: false, error: 'Server error while creating chat.' });
    }
});

// Get all chats for the logged-in user
router.get('/my-chats', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const chats = await Chat.find({ $or: [{ buyer: userId }, { seller: userId }] })
            .populate('product', 'title')
            .populate('buyer', 'name')
            .populate('seller', 'name')
            .sort({ lastMessageAt: -1 });

        res.json({ success: true, chats: chats });
    } catch (error) {
        console.error('Error fetching user chats:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get a single chat's details and message history
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const chatId = req.params.id;
        const chat = await Chat.findById(chatId)
            .populate('product', 'title')
            .populate('buyer', 'name')
            .populate('seller', 'name')
            .populate('messages.sender', 'name');

        if (!chat) {
            return res.status(404).json({ success: false, error: 'Chat not found.' });
        }
        
        const userId = req.user.userId;
        if (chat.buyer._id.toString() !== userId && chat.seller._id.toString() !== userId) {
            return res.status(403).json({ success: false, error: 'Not authorized to view this chat.' });
        }

        res.json({ success: true, chat: chat });
    } catch (error) {
        console.error('Error fetching single chat:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

module.exports = router;

