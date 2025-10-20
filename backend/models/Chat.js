const mongoose = require('mongoose');

// Message Schema (nested in Chat)
const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: [true, 'Message text is required'],
        trim: true,
        maxlength: [1000, 'Message cannot exceed 1000 characters']
    },
    isRead: {
        type: Boolean,
        default: false
    },
    readAt: {
        type: Date
    }
}, {
    timestamps: true
});

// Chat Schema
const chatSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messages: [messageSchema],
    lastMessage: {
        type: String,
        default: ''
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // For negotiation
    proposedPrice: {
        type: Number,
        default: null
    },
    isPriceAccepted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
chatSchema.index({ buyer: 1, product: 1 });
chatSchema.index({ seller: 1 });
chatSchema.index({ lastMessageAt: -1 });

// Compound index to prevent duplicate chats
chatSchema.index({ buyer: 1, seller: 1, product: 1 }, { unique: true });

// Method to add a new message
chatSchema.methods.addMessage = function(senderId, text) {
    this.messages.push({
        sender: senderId,
        text: text
    });
    this.lastMessage = text;
    this.lastMessageAt = new Date();
    return this.save();
};

// Method to mark all messages as read
chatSchema.methods.markAsRead = function(userId) {
    this.messages.forEach(msg => {
        if (msg.sender.toString() !== userId.toString() && !msg.isRead) {
            msg.isRead = true;
            msg.readAt = new Date();
        }
    });
    return this.save();
};

// Method to get unread message count
chatSchema.methods.getUnreadCount = function(userId) {
    return this.messages.filter(msg => 
        msg.sender.toString() !== userId.toString() && !msg.isRead
    ).length;
};

// Static method to find or create chat
chatSchema.statics.findOrCreate = async function(buyerId, sellerId, productId) {
    let chat = await this.findOne({
        buyer: buyerId,
        seller: sellerId,
        product: productId
    });

    if (!chat) {
        chat = await this.create({
            buyer: buyerId,
            seller: sellerId,
            product: productId
        });
    }

    return chat;
};

// Static method to get user's all chats
chatSchema.statics.getUserChats = function(userId) {
    return this.find({
        $or: [
            { buyer: userId },
            { seller: userId }
        ],
        isActive: true
    })
    .populate('product', 'title price images status')
    .populate('buyer', 'name profilePicture')
    .populate('seller', 'name profilePicture')
    .sort({ lastMessageAt: -1 });
};

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;