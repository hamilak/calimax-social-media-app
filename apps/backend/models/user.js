const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: 'default.png'
    },
    bio: {
        type: String,
        default: ''
    },
    accountStatus: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    socialLinks: {
        facebook: { type: String, default: '' },
        twitter: { type: String, default: '' },
        instagram: { type: String, default: '' }
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    refreshToken: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('User', userSchema);