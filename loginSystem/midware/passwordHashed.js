const bcrypt = require('bcrypt');
const userSchema = require('../model/userModel');
const mongoose = require('mongoose');

// password hashing
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

// const userModel = mongoose.model('user', userSchema)