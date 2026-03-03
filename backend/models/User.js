const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema
 * - Passwords are automatically hashed before saving via a pre-save hook.
 * - `matchPassword` instance method compares a plain-text candidate against the hash.
 */
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot exceed 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
        },
        password: {
            type: String,
            required: [true, 'Please provide a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false, // Never return password in queries by default
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
