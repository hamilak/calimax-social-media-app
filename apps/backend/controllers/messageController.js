const MessageModel = require('../models/messages');
const UserModel = require('../models/user');

// Save a message
exports.sendMessage = async (req, res) => {
    try {
        const { receiverId, text } = req.body;
        const senderId = req.user._id;

        const message = new MessageModel({ senderId, receiverId, text });
        await message.save();

        const populatedMessage = await message
            .populate('senderId', 'username profilePicture')
            .populate('receiverId', 'username profilePicture')
            .execPopulate();

        req.io.to(receiverId).emit('receiveMessage', populatedMessage);

        res.status(201).send(populatedMessage);
    } catch (error) {
        res.status(400).send({ message: 'Error sending message', error: error.message });
    }
};

// Get messages between two users
exports.getMessages = async (req, res) => {
    try {
        const { userId } = req.params.userId;
        const currentUserId = req.user._id;

        const messages = await MessageModel.find({
            $or: [
                { senderId: userId, receiverId: currentUserId },
                { senderId: currentUserId, receiverId: userId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('senderId', 'username profilePicture')
            .populate('receiverId', 'username profilePicture');

        res.status(200).send(messages);
    } catch (error) {
        res.status(400).send({ message: 'Error fetching messages', error: error.message });
    }
};
