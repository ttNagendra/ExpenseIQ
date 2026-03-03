const mongoose = require('mongoose');

/**
 * Transaction Schema
 * - Each transaction belongs to a user (userId ref).
 * - `type` is either "income" or "expense".
 * - `category` allows flexible categorization (Food, Salary, Rent, etc.).
 * - `date` defaults to the current date if not provided.
 */
const transactionSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true, // Index for fast per-user queries
        },
        type: {
            type: String,
            enum: {
                values: ['income', 'expense'],
                message: 'Type must be either income or expense',
            },
            required: [true, 'Please specify transaction type'],
        },
        category: {
            type: String,
            required: [true, 'Please specify a category'],
            trim: true,
            maxlength: [30, 'Category cannot exceed 30 characters'],
        },
        amount: {
            type: Number,
            required: [true, 'Please specify an amount'],
            min: [0.01, 'Amount must be greater than 0'],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [200, 'Description cannot exceed 200 characters'],
            default: '',
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Compound index for common query patterns
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);
