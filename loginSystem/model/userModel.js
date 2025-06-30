const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,     // regrex
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    gender: {
        type: String,
        // required: true
    },
    phoneNumber: {
        type: String,
        // required: true,
    },
    isVarified: {
        type: Boolean,
        default: false,
    },
    token: {
        type: String,
        default: null,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
});

// Password hashing
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        console.error('Error password hashing:',error)
        return next(error);
    }
});

const userModel = mongoose.model('user', userSchema);

module.exports = userModel; 